/**
 * 重写属性，并尽可能保证不被覆盖。
 *
 * 只支持重写为 value ，不支持重写为 accessor 。
 */
export function rewriteValue<Target, Key extends keyof Target>(
  target: Target,
  key: Key,
  createValue: (getCopy: () => Target[Key]) => Target[Key],
): () => void {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    // 属性被定义，但是不可配置
    if (descriptor && !descriptor.configurable) {
      const copied = target[key];
      const value = createValue(() => copied);

      target[key] = value;

      return function reset(): void {
        if (target[key] !== value)
          // eslint-disable-next-line no-console
          console.error(`'${key}' changed since last rewrite.`);

        target[key] = copied;
      };
    }

    // 原属性定义了 getter
    if (descriptor && descriptor.get) {
      const value = createValue(descriptor.get.bind(target));

      const get = function get() {
        return value;
      };

      Object.defineProperty(target, key, { ...descriptor, get });

      return function reset(): void {
        const currentDescriptor = Object.getOwnPropertyDescriptor(target, key);
        if (!currentDescriptor || currentDescriptor.get !== get)
          // eslint-disable-next-line no-console
          console.error(`'${key}' changed since last rewrite.`);

        Object.defineProperty(target, key, descriptor);
      };
    }

    let copied = target[key];
    const value = createValue(() => copied);
    const enumerable = descriptor ? descriptor.enumerable : true;

    const get = function get() {
      return value;
    };

    const set = function set(next: Target[Key]) {
      copied = next;
    };

    Object.defineProperty(target, key, { configurable: true, enumerable, get, set });

    return function reset(): void {
      const currentDescriptor = Object.getOwnPropertyDescriptor(target, key);
      if (!currentDescriptor || currentDescriptor.get !== get || currentDescriptor.set !== set)
        // eslint-disable-next-line no-console
        console.error(`'${key}' changed since last rewrite.`);

      if (descriptor) Object.defineProperty(target, key, descriptor);
      else delete target[key];
    };
  } catch {}

  return function reset(): void {};
}
