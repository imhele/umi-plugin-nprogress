import { NProgress, NProgressConfigureOptions } from './n-progress';

/**
 * 获取 nprogress 当前的配置。
 */
export function useNProgressConfig(): Required<NProgressConfigureOptions>;
/**
 * 配置 nprogress 。
 */
export function useNProgressConfig(config: NProgressConfigureOptions): void;
export function useNProgressConfig(
  config?: NProgressConfigureOptions,
): Required<NProgressConfigureOptions> | void {
  if (config) NProgress.configure(config);
  else return NProgress.settings;
}
