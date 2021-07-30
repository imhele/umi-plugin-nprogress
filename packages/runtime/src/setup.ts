import { Progress } from './progress';
import { rewriteValue } from './rewrite';

let reset: (() => void) | undefined;

export function resetNProgressPluginRuntime(): boolean {
  if (!reset) return false;
  reset();
  return true;
}

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
  return rewriteValue(target, 'fetch', (getCopy) => {
    return function fetch(...args) {
      const { reject, resolve } = progress.allocate();
      return getCopy()(...args).then(resolve, reject);
    };
  });
}

function setupXMLHttpRequest(target: typeof globalThis, progress: Progress): () => void {
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
