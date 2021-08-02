export interface UmiPluginNProgressConfig {
  /**
   * 是否需要兼容到 IE 11 。
   *
   * 默认兼容到 **chrome 67, edge 79, firefox 64, safari 12.1** ，
   * 启用此配置后将兼容到 **chrome 50, edge 12, ie 11, firefox 50, safari 10** 。
   *
   * 如需兼容更低版本，请直接配置 umi-plugin-nprogress-runtime 依赖走 babel 编译。
   *
   * @default false
   */
  ie11?: boolean | 'esm' | 'cjs';
}

export function DefaultUmiPluginNProgressConfig(): UmiPluginNProgressConfig {
  return {};
}
