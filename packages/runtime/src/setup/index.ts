import { Progress } from './progress';
import { setupFetch } from './setupFetch';
import { setupXMLHttpRequest } from './setupXMLHttpRequest';

let reset: (() => void) | undefined;

/**
 * 重写 fetch 与 XMLHttpRequest ，以捕获浏览器请求的发起，并在期间展示进度条。
 *
 * @returns 返回一个函数用于撤销重写操作，也可以直接调用 `resetNProgressPluginRuntime()` ，效果是一样的。
 */
export function setupNProgressPluginRuntime(): () => void {
  // 已经 setup 过了，无需重复处理
  if (reset) return reset;

  // 非浏览器环境不启用
  if (typeof window === 'undefined') return () => {};

  const progress = new Progress();
  const resetFetch = setupFetch(window, progress);
  const resetXMLHttpRequest = setupXMLHttpRequest(window, progress);

  reset = () => {
    resetFetch();
    resetXMLHttpRequest();
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
