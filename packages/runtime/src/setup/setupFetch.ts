import type { Progress } from './progress';
import { rewriteValue } from './rewriteValue';

/**
 * 重写 fetch 方法，以监听请求进度。
 */
export function setupFetch(target: typeof globalThis, progress: Progress): () => void {
  if (typeof target.fetch !== 'function') return function reset() {};

  return rewriteValue(target, 'fetch', (getCopy) => {
    return function fetch(...args) {
      const { reject, resolve } = progress.allocate();
      return getCopy()(...args).then(resolve, reject);
    };
  });
}
