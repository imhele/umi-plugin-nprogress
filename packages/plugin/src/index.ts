import type { IApi } from 'umi';
import { name } from '../package.json';

export default function nprogress(api: IApi): void {
  api.describe({
    key: 'nprogress',
  });

  // 引入 nprogress 样式
  api.addEntryImports(() => {
    return [{ source: 'nprogress/nprogress.css' }];
  });

  // 导出运行时 api
  api.addUmiExports(() => {
    return [{ source: name, exportAll: true }];
  });
}
