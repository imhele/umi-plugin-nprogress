import { dirname } from 'path';
import type { IApi } from 'umi';
import {
  NProgressPkgName,
  NProgressStyleSource,
  PluginKey,
  RuntimeAPIIe11CjsDirectory,
  RuntimeAPIIe11EsmDirectory,
  RuntimeAPIPkgName,
} from './constants';
import {
  DefaultUmiPluginNProgressConfig,
  UmiPluginNProgressConfig,
  describeConfig,
} from './interfaces';

export { UmiPluginNProgressConfig };

export default function nprogress(api: IApi): void {
  let getConfig = (): UmiPluginNProgressConfig => {
    const config = api.config[PluginKey] || DefaultUmiPluginNProgressConfig();
    getConfig = () => config;
    return config;
  };

  api.describe({
    key: PluginKey,
    config: describeConfig(),
  });

  // 引入 nprogress 样式
  api.addEntryImports(() => {
    return [{ source: NProgressStyleSource }];
  });

  // 优先依赖 plugin 安装的 runtime ，尤其是在 pnpm 下
  api.addProjectFirstLibraries(() => {
    const RuntimeAPIPkgPath = resolveDependency(RuntimeAPIPkgName);
    const NProgressPkgPath = resolveDependency(NProgressPkgName, RuntimeAPIPkgPath);
    return [
      { name: RuntimeAPIPkgName, path: RuntimeAPIPkgPath },
      { name: NProgressPkgName, path: NProgressPkgPath },
    ];
  });

  // 导出运行时 api
  api.addUmiExports(() => {
    return [{ source: getRuntimeAPIExportSource(), exportAll: true }];
  });

  function getRuntimeAPIExportSource(): string {
    if (!getConfig().ie11) return RuntimeAPIPkgName;
    if (getConfig().ie11 === 'cjs') return `${RuntimeAPIPkgName}/${RuntimeAPIIe11CjsDirectory}`;
    return `${RuntimeAPIPkgName}/${RuntimeAPIIe11EsmDirectory}`;
  }

  function resolveDependency(id: string, path: string = __dirname): string {
    try {
      return dirname(require.resolve(`${id}/package.json`, { paths: [path] }));
    } catch (error) {
      api.logger.error(error);
    }

    return id;
  }
}
