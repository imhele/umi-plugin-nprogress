import { dirname } from 'path';
import type { IApi } from 'umi';
import { PluginKey, RuntimeAPIPkgName } from './constants';
import { DefaultUmiPluginNProgressConfig, UmiPluginNProgressConfig } from './interfaces';

export { UmiPluginNProgressConfig };

export default function nprogress(api: IApi): void {
  const config: UmiPluginNProgressConfig =
    api.config[PluginKey] || DefaultUmiPluginNProgressConfig();

  api.describe({
    key: PluginKey,
    config: {
      default: DefaultUmiPluginNProgressConfig(),
      schema: (joi) =>
        joi.object({
          ie11: joi.equal('esm', 'cjs', true, false).description('是否需要兼容到 IE 11'),
        }),
    },
  });

  // 引入 nprogress 样式
  api.addEntryImports(() => {
    return [{ source: 'nprogress/nprogress.css' }];
  });

  // 优先依赖 plugin 安装的 runtime ，尤其是在 pnpm 下
  api.addProjectFirstLibraries(() => {
    return [{ name: RuntimeAPIPkgName, path: getRuntimeAPIPkgPath() }];
  });

  // 导出运行时 api
  api.addUmiExports(() => {
    return [{ source: getRuntimeAPIExportSource(), exportAll: true }];
  });

  function getRuntimeAPIPkgPath(): string {
    try {
      return dirname(require.resolve(`${RuntimeAPIPkgName}/package.json`));
    } catch (error) {
      api.logger.error(error);
    }

    return RuntimeAPIPkgName;
  }

  function getRuntimeAPIExportSource(): string {
    if (!config.ie11) return RuntimeAPIPkgName;
    if (config.ie11 === 'cjs') return `${RuntimeAPIPkgName}/ie11-lib`;
    return `${RuntimeAPIPkgName}/ie11-es`;
  }
}
