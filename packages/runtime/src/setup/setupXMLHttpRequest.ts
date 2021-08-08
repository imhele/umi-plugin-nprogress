import type { Progress } from './progress';
import { rewriteValue } from './rewriteValue';

/**
 * 重写 XMLHttpRequest.prototype.send 方法，以监听请求进度。
 */
export function setupXMLHttpRequest(target: typeof globalThis, progress: Progress): () => void {
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
