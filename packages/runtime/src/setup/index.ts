import { Progress } from './progress';
import { setupFetch } from './setupFetch';
import { setupXMLHttpRequest } from './setupXMLHttpRequest';

let reset: (() => void) | undefined;

export interface UmiPluginNProgressRuntimeConfig {
  /**
   * 启用对 XMLHttpRequest 的监听。
   *
   * @default
   * ```ts
   * true
   * ```
   */
  readonly XMLHttpRequest?: boolean;
  /**
   * 启用对 fetch 的监听。
   *
   * @default
   * ```ts
   * true
   * ```
   */
  readonly fetch?: boolean;
}

/**
 * 重写 fetch 与 XMLHttpRequest ，以捕获浏览器请求的发起，并在期间展示进度条。
 *
 * @returns 返回一个函数用于撤销重写操作，也可以直接调用 `resetNProgressPluginRuntime()` ，效果是一样的。
 */
export function setupNProgressPluginRuntime(
  options: UmiPluginNProgressRuntimeConfig = {},
): () => void {
  // 已经 setup 过了，先重置
  if (reset) reset();

  // 非浏览器环境不启用
  if (typeof window === 'undefined') return () => {};

  const { XMLHttpRequest: listenXMLHttpRequest = true, fetch: listenFetch = true } = options;

  const progress = new Progress();
  const resetFetch = listenFetch ? setupFetch(window, progress) : null;
  const resetXMLHttpRequest = listenXMLHttpRequest ? setupXMLHttpRequest(window, progress) : null;

  reset = () => {
    if (resetFetch) resetFetch();
    if (resetXMLHttpRequest) resetXMLHttpRequest();
    reset = undefined;
  };

  return reset;
}

/**
 * 撤销 `setupNProgressPluginRuntime()` 对于 fetch 与 XMLHttpRequest 的重写。
 */
export function resetNProgressPluginRuntime(): boolean {
  if (!reset) return false;
  reset();
  return true;
}
