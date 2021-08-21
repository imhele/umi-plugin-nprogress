import { dirname } from 'path';
import type { IApi } from 'umi';
import {
  NProgressPkgName,
  NProgressStyleSource,
  PluginKey,
  RuntimeAPIIe11CjsDirectory,
  RuntimeAPIIe11EsmDirectory,
  RuntimeAPIPkgName,
  RuntimeInjectionFilePath,
} from './constants';
import { UmiPluginNProgressConfig, describeConfig } from './interfaces';
import { CreateRuntimeProgramOptions, createRuntimeProgram, printSourceFile } from './runtime';

export { UmiPluginNProgressConfig };

export default function nprogress(api: IApi): void {
  let getConfig = (): UmiPluginNProgressConfig => {
    // joi scheme 设置了默认值，按理来说这里不会为 undefined
    const config = api.config[PluginKey];
    getConfig = () => config;
    return config;
  };

  api.describe({
    key: PluginKey,
    config: describeConfig(),
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

  // 生成临时文件
  api.onGenerateFiles(() => {
    const createRuntimeProgramOptions: CreateRuntimeProgramOptions = {
      ...getConfig(),
      runtimeAPISource: getRuntimeAPISource(),
    };

    // 注入配置
    api.writeTmpFile({
      path: RuntimeInjectionFilePath,
      content: printSourceFile(createRuntimeProgram(createRuntimeProgramOptions)),
    });
  });

  // 导出运行时 api
  api.addUmiExports(() => {
    return [{ source: getRuntimeAPISource(), exportAll: true }];
  });

  // 引入 nprogress 样式与注入运行时的配置
  api.addEntryImports(() => {
    return [{ source: NProgressStyleSource }, { source: RuntimeInjectionFilePath }];
  });

  function getRuntimeAPISource(): string {
    if (!getConfig().ie11) return RuntimeAPIPkgName;
    if (getConfig().ie11 === 'cjs') return `${RuntimeAPIPkgName}/${RuntimeAPIIe11CjsDirectory}`;
    return `${RuntimeAPIPkgName}/${RuntimeAPIIe11EsmDirectory}`;
  }

  function resolveDependency(id: string, path: string = __dirname): string {
    return dirname(require.resolve(`${id}/package.json`, { paths: [path] }));
  }
}
