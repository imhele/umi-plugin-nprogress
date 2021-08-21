import { readdirSync } from 'fs';
import { join } from 'path';
import { Service } from 'umi';
import {
  NProgressPkgName,
  NProgressStyleSource,
  PluginKey,
  RuntimeAPIIe11CjsDirectory,
  RuntimeAPIIe11EsmDirectory,
  RuntimeAPIPkgName,
  RuntimeInjectionFilePath,
} from './constants';
import plugin from './index';

const pluginAbsPath = join(__dirname, './index');
const fixturesAbsPath = join(__dirname, './__fixtures__');

describe('function nprogress()', () => {
  it('should exist', async () => {
    expect(plugin).toEqual(expect.any(Function));
  });

  for (const dirent of readdirSync(fixturesAbsPath, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;

    describe(dirent.name, () => {
      const writeTmpFile = jest.fn();
      const cwd = join(fixturesAbsPath, dirent.name);
      const service = new Service({ cwd });

      service.initialPlugins.push({
        id: PluginKey,
        key: PluginKey,
        path: pluginAbsPath,
        apply: () => plugin,
      });

      beforeAll(async () => {
        await service.init();

        service.pluginMethods.writeTmpFile = writeTmpFile;
        service.hooksByPluginId = { [PluginKey]: service.hooksByPluginId[PluginKey] };

        Object.getOwnPropertyNames(service.hooks)
          .concat(Object.getOwnPropertySymbols(service.hooks) as never[] as string[])
          .forEach((key) => {
            service.hooks[key] = service.hooks[key].filter((hook) => hook.pluginId === PluginKey);
          });
      });

      afterEach(() => {
        writeTmpFile.mockClear();
      });

      it('should be registered after initialization', () => {
        expect(service.hasPlugins([PluginKey])).toBe(true);
        expect(service.hooksByPluginId[PluginKey]).toBeDefined();
      });

      it('should add runtime deps resolutions', async () => {
        const deps: Record<PropertyKey, unknown>[] = await service.applyPlugins({
          key: 'addProjectFirstLibraries',
          type: service.ApplyPluginsType.add,
        });

        const depNames = deps.map((dep) => dep.name);
        expect(depNames).toContain(NProgressPkgName);
        expect(depNames).toContain(RuntimeAPIPkgName);
      });

      it('should generate runtime injection file', async () => {
        await service.applyPlugins({
          key: 'onGenerateFiles',
          type: service.ApplyPluginsType.add,
          args: { files: [] },
        });

        expect(writeTmpFile).toBeCalledTimes(1);
        expect(writeTmpFile.mock.calls[0][0]).toMatchObject({ path: RuntimeInjectionFilePath });
        expect(writeTmpFile.mock.calls[0][0].content).toMatchSnapshot();
      });

      it('should export runtime api', async () => {
        const deps: Record<PropertyKey, unknown>[] = await service.applyPlugins({
          key: 'addUmiExports',
          type: service.ApplyPluginsType.add,
        });

        const depNames = deps.map((dep) => dep.source);
        expect(depNames).toContain(getRuntimeAPISource());
      });

      it('should add entry import statements', async () => {
        const deps: Record<PropertyKey, unknown>[] = await service.applyPlugins({
          key: 'addEntryImports',
          type: service.ApplyPluginsType.add,
        });

        const depNames = deps.map((dep) => dep.source);
        expect(depNames).toContain(NProgressStyleSource);
        expect(depNames).toContain(RuntimeInjectionFilePath);
      });

      function getRuntimeAPISource(): string {
        const ie11 = service.config?.nprogress?.ie11;
        if (!ie11) return RuntimeAPIPkgName;
        if (ie11 === 'cjs') return `${RuntimeAPIPkgName}/${RuntimeAPIIe11CjsDirectory}`;
        return `${RuntimeAPIPkgName}/${RuntimeAPIIe11EsmDirectory}`;
      }
    });
  }
});
