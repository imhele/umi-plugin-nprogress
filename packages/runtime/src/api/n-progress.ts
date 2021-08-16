// Type definitions for NProgress
// Project: https://github.com/rstacruz/nprogress
// Definitions by: Judah Gabriel Himango <http://debuggerdotbreak.wordpress.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// @ts-expect-error nprogress
import NProgressAlias from 'nprogress';

export interface NProgressStatic {
  /**
   * Configures the progress indicator.
   * @param {NProgressConfigureOptions} options An object containing the configuration options.
   * @returns {this} The current NProgress object, useful for chaining.
   */
  configure(options: NProgressConfigureOptions): this;

  /**
   * Finishes loading by transitioning it to 100%, then fading out.
   * @param {boolean} forceShow Forces the progress bar to show, even if it's not being shown. (The default behavior is that .done() will not do anything if .start() isn't called.)
   * @returns {this} The current NProgress object, useful for chaining.
   */
  done(forceShow?: boolean): this;

  /**
   * Increments the progress bar with a random amount. This will never get to 100%: use it for every image load (or similar).
   * @returns {this} The current NProgress object, useful for chaining.
   */
  inc(): this;

  /**
   * Increments the progress bar with a set amount.
   * @param {number} amount This will get the current status value and adds the value until status is max 0.994
   * @returns {this} The current NProgress object, useful for chaining.
   */
  inc(amount: number): this;

  /**
   * Gets whether progress has been started.
   * @returns {boolean} Whether the progress has started.
   */
  isStarted(): boolean;

  /**
   * Removes the progress indicator.
   */
  remove(): void;

  /**
   * Sets the progress percentage.
   * @param {number} progressPercent A number between 0.0 and 1.0 that represents the progress percentage.
   * @returns {this} The current NProgress object, useful for chaining.
   */
  set(progressPercent: number): this;

  /**
   * Configurations of the progress indicator. Can be changed by .configure().
   */
  settings: Required<NProgressConfigureOptions>;

  /**
   * Shows the progress bar and begins trickling progress.
   * @returns {this} The current NProgress object, useful for chaining.
   */
  start(): this;

  /**
   * Gets the status. If started, it will be the last progress number set.
   */
  status: number | null;

  /**
   * Gets the NProgress version.
   */
  version: string;
}

export interface NProgressConfigureOptions {
  /**
   * 使用的 CSS 动效曲线，默认为 'ease' 。
   *
   * The CSS easing animation to use. Default is 'ease'.
   */
  readonly easing?: string;

  /**
   * 进度条最小的百分比，默认为 0.08 。
   *
   * The minimum progress percentage. Default is 0.08.
   */
  readonly minimum?: number;

  /**
   * 配置进度条 DOM 容器，需要是一个 CSS 选择器，默认为 'body' 。
   *
   * CSS selector to change the parent DOM element of the progress. Default is 'body'.
   */
  readonly parent?: string;

  /**
   * 是否在进度条出现时展示旋转的圆圈图标，默认展示。
   *
   * Whether to show the spinner. Default to true.
   */
  readonly showSpinner?: boolean;

  /**
   * 动画的速度（毫秒计），默认为 200 。
   *
   * The animation speed in milliseconds. Default is 200.
   */
  readonly speed?: number;

  /**
   * 进度条的 HTML 渲染模板，其中至少包含一个 HTML 属性 role 为 'bar' 的元素。
   *
   * The HTML markup inserted for the progress indicator. To keep the progress bar working, keep an element with role='bar' in there.
   */
  readonly template?: string;

  /**
   * 在展示进度条时，是否定时随机前进一点，默认启用。
   *
   * Whether to enable trickling the progress. Default is true.
   */
  readonly trickle?: boolean;

  /**
   * 进度条定时随机前进的间隔，默认为 800 。
   *
   * How often to trickle, in milliseconds. Default is 800.
   */
  readonly trickleSpeed?: number;
}

export const NProgress: NProgressStatic = NProgressAlias as unknown as NProgressStatic;
