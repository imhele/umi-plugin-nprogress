import type { IApi } from 'umi';
import type {
  NProgressConfigureOptions,
  UmiPluginNProgressRuntimeConfig,
} from 'umi-plugin-nprogress-runtime';
import { Translations } from './locales';

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
  /**
   * 运行时的插件配置。
   */
  runtime?: UmiPluginNProgressRuntimeConfig;
  /**
   * 配置 nprogress 进度条的动效曲线、挂载容器、增速、渲染模板等样式。
   */
  ui?: NProgressConfigureOptions;
}

export function DefaultUmiPluginNProgressConfig(): UmiPluginNProgressConfig {
  return {};
}

export function describeConfig(): IApi['describe'] extends (options: infer Options) => unknown
  ? Options extends { config?: unknown }
    ? NonNullable<Options['config']>
    : never
  : never {
  return {
    default: DefaultUmiPluginNProgressConfig(),
    schema: (joi) =>
      joi.object({
        ie11: joi.equal('esm', 'cjs', true, false).description(Translations.ConfigIe11Description),
        /** @type {UmiPluginNProgressRuntimeConfig} */
        runtime: joi
          .object({
            XMLHttpRequest: joi
              .boolean()
              .description(Translations.ConfigRuntimeXMLHttpRequestDescription),
            fetch: joi.boolean().description(Translations.ConfigRuntimeFetchDescription),
          })
          .description(Translations.ConfigRuntimeDescription),
        /** @type {NProgressConfigureOptions} */
        ui: joi
          .object({
            easing: joi.string().description(Translations.ConfigUiEasingDescription),
            minimum: joi
              .number()
              .min(0)
              .max(1)
              .description(Translations.ConfigUiMinimumDescription),
            parent: joi.string().description(Translations.ConfigUiParentDescription),
            showSpinner: joi.boolean().description(Translations.ConfigUiShowSpinnerDescription),
            speed: joi.number().positive().description(Translations.ConfigUiSpeedDescription),
            template: joi.string().description(Translations.ConfigUiTemplateDescription),
            trickle: joi.boolean().description(Translations.ConfigUiTrickleDescription),
            trickleSpeed: joi
              .number()
              .positive()
              .description(Translations.ConfigUiTrickleSpeedDescription),
          })
          .unknown(true)
          .description(Translations.ConfigUiDescription),
      }),
  };
}
