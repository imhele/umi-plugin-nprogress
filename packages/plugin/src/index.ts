import { dirname } from 'path';
import type { IApi } from 'umi';

const RuntimePkgName = 'umi-plugin-nprogress-runtime';

export default function nprogress(api: IApi): void {
  api.describe({
    key: 'nprogress',
  });

  // 引入 nprogress 样式
  api.addEntryImports(() => {
    return [{ source: 'nprogress/nprogress.css' }];
  });

  // 优先依赖 plugin 安装的 runtime
  api.addProjectFirstLibraries(() => {
    const runtimePkgDir = dirname(require.resolve(`${RuntimePkgName}/package.json`));
    return [{ name: RuntimePkgName, path: runtimePkgDir }];
  });

  // 导出运行时 api
  api.addUmiExports(() => {
    return [{ source: RuntimePkgName, exportAll: true }];
  });
}
