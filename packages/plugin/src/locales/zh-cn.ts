import { TranslationMap } from './interface';

const Translations: TranslationMap = {
  ConfigIe11Description:
    '是否需要兼容到 IE 11 。\n\n' +
    '默认兼容到 `chrome 67, edge 79, firefox 64, safari 12.1` ，' +
    '启用此配置后将兼容到 `chrome 50, edge 12, ie 11, firefox 50, safari 10` 。\n\n' +
    '如需兼容更低版本，请直接配置 umi-plugin-nprogress-runtime 依赖走 babel 编译。',
  ConfigRuntimeDescription: '运行时的插件配置。',
  ConfigRuntimeFetchDescription: '启用对 fetch 的监听，默认启用。',
  ConfigRuntimeXMLHttpRequestDescription: '启用对 XMLHttpRequest 的监听，默认启用。',
  ConfigUiDescription: '配置 nprogress 进度条的动效曲线、挂载容器、增速、渲染模板等样式。',
  ConfigUiEasingDescription: `使用的 CSS 动效曲线，默认为 'ease' 。`,
  ConfigUiMinimumDescription: `进度条最小的百分比，默认为 0.08 。`,
  ConfigUiParentDescription: `配置进度条 DOM 容器，需要是一个 CSS 选择器，默认为 'body' 。`,
  ConfigUiShowSpinnerDescription: `是否在进度条出现时展示旋转的圆圈图标，默认展示。`,
  ConfigUiSpeedDescription: `动画的速度（毫秒计），默认为 200 。`,
  ConfigUiTemplateDescription: `进度条的 HTML 渲染模板，其中至少包含一个 HTML 属性 role 为 'bar' 的元素。`,
  ConfigUiTrickleDescription: `在展示进度条时，是否定时随机前进一点，默认启用。`,
  ConfigUiTrickleSpeedDescription: `进度条定时随机前进的间隔，默认为 800 。`,
  CreateTSLiteralUnsupportedValueError: (type) =>
    `创建 TypeScript Literal 时，不支持类型为 ${type} 的值。`,
};

export default Translations;
