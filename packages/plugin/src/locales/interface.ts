export interface TranslationMap {
  /**
   * 是否需要兼容到 IE 11 。
   *
   * 默认兼容到 **chrome 67, edge 79, firefox 64, safari 12.1** ，
   * 启用此配置后将兼容到 **chrome 50, edge 12, ie 11, firefox 50, safari 10** 。
   *
   * 如需兼容更低版本，请直接配置 umi-plugin-nprogress-runtime 依赖走 babel 编译。
   */
  readonly ConfigIe11Description: string;
  /**
   * 运行时的插件配置。
   */
  readonly ConfigRuntimeDescription: string;
  /**
   * 启用对 fetch 的监听，默认启用。
   */
  readonly ConfigRuntimeFetchDescription: string;
  /**
   * 启用对 XMLHttpRequest 的监听，默认启用。
   */
  readonly ConfigRuntimeXMLHttpRequestDescription: string;
  /**
   * 配置 nprogress 进度条的动效曲线、挂载容器、增速、渲染模板等样式。
   */
  readonly ConfigUiDescription: string;
  /**
   * 使用的 CSS 动效曲线，默认为 'ease' 。
   */
  readonly ConfigUiEasingDescription: string;
  /**
   * 进度条最小的百分比，默认为 0.08 。
   */
  readonly ConfigUiMinimumDescription: string;
  /**
   * 配置进度条 DOM 容器，需要是一个 CSS 选择器，默认为 'body' 。
   */
  readonly ConfigUiParentDescription: string;
  /**
   * 是否在进度条出现时展示旋转的圆圈图标，默认展示。
   */
  readonly ConfigUiShowSpinnerDescription: string;
  /**
   * 动画的速度（毫秒计），默认为 200 。
   */
  readonly ConfigUiSpeedDescription: string;
  /**
   * 进度条的 HTML 渲染模板，其中至少包含一个 HTML 属性 role 为 'bar' 的元素。
   */
  readonly ConfigUiTemplateDescription: string;
  /**
   * 在展示进度条时，是否定时随机前进一点，默认启用。
   */
  readonly ConfigUiTrickleDescription: string;
  /**
   * 进度条定时随机前进的间隔，默认为 800 。
   */
  readonly ConfigUiTrickleSpeedDescription: string;
}
