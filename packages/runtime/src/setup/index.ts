import { Progress } from './progress';
import { rewriteValue } from './rewrite';

let reset: (() => void) | undefined;

/**
 * 撤销 `setupNProgressPluginRuntime()` 对于 fetch 与 XMLHttpRequest 的重写。
 */
export function resetNProgressPluginRuntime(): boolean {
  if (!reset) return false;
  reset();
  return true;
}

/**
 * 重写 fetch 与 XMLHttpRequest ，以捕获浏览器请求的发起，并在期间展示进度条。
 *
 * @returns 返回一个函数用于撤销重写操作，也可以直接调用 `resetNProgressPluginRuntime()` ，效果是一样的。
 */
export function setupNProgressPluginRuntime(): () => void {
  if (!isBrowser()) return () => {};

  if (!reset) {
    const progress = new Progress();
    const resetFetch = setupFetch(window, progress);
    const resetXMLHttpRequest = setupXMLHttpRequest(window, progress);

    reset = () => {
      resetFetch();
      resetXMLHttpRequest();
      reset = undefined;
    };
  }

  return reset;
}

setupNProgressPluginRuntime();

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function setupFetch(target: typeof globalThis, progress: Progress): () => void {
  if (typeof target.fetch !== 'function') return function reset() {};

  return rewriteValue(target, 'fetch', (getCopy) => {
    return function fetch(...args) {
      const { reject, resolve } = progress.allocate();
      return getCopy()(...args).then(resolve, reject);
    };
  });
}

function setupXMLHttpRequest(target: typeof globalThis, progress: Progress): () => void {
  if (!('XMLHttpRequest' in target)) return function reset() {};

  return rewriteValue(target.XMLHttpRequest.prototype, 'send', (getCopy) => {
    return function send(this: XMLHttpRequest, ...args: unknown[]) {
      // send 执行时会校验 this 是否是 XMLHttpRequest 实例
      const result = getCopy().apply(this, args as never);

      const { settled } = progress.allocate();

      const onloadend = () => {
        settled();
        this.removeEventListener('loadend', onloadend);
      };

      this.addEventListener('loadend', onloadend);

      return result;
    };
  });
}
