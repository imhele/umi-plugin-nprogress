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
  let hasBeenReset = false;

  try {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    // 属性被定义，但是不可配置
    if (descriptor && !descriptor.configurable) {
      const copied = target[key];
      const value = createValue(throwErrorForCallsAfterReset(() => copied));

      target[key] = value;

      return throwErrorForCallsAfterReset((): void => {
        hasBeenReset = true;

        if (target[key] !== value)
          // eslint-disable-next-line no-console
          console.error(`'${key}' changed since last rewrite.`);

        target[key] = copied;
      });
    }

    // 原属性定义了 getter
    if (descriptor && descriptor.get) {
      const value = createValue(throwErrorForCallsAfterReset(descriptor.get.bind(target)));

      const get = function get() {
        return value;
      };

      Object.defineProperty(target, key, { ...descriptor, get });

      return throwErrorForCallsAfterReset((): void => {
        resetPropertyAccessor(descriptor, get, undefined);
      });
    }

    if (descriptor && descriptor.set) {
      const copied = target[key];
      const setter = descriptor.set.bind(target);
      const value = createValue(throwErrorForCallsAfterReset(() => copied));

      const get = function get() {
        return value;
      };

      const set = function set(next: Target[Key]) {
        setter(next);
      };

      Object.defineProperty(target, key, { ...descriptor, get, set });

      return throwErrorForCallsAfterReset((): void => {
        resetPropertyAccessor(descriptor, get, set);
      });
    }

    let updated = false;
    let copied = target[key];
    const value = createValue(throwErrorForCallsAfterReset(() => copied));
    const enumerable = descriptor ? descriptor.enumerable : true;

    const get = function get() {
      return value;
    };

    const set = function set(next: Target[Key]) {
      if (descriptor && !descriptor.writable) return;
      copied = next;
      updated = true;
    };

    Object.defineProperty(target, key, { configurable: true, enumerable, get, set });

    return throwErrorForCallsAfterReset((): void => {
      const next = updated
        ? descriptor
          ? { ...descriptor, value: copied }
          : { configurable: true, enumerable: true, value: copied, writable: true }
        : descriptor;

      resetPropertyAccessor(next, get, set);
    });
  } catch {}

  return throwErrorForCallsAfterReset((): void => {
    hasBeenReset = true;
  });

  function throwErrorForCallsAfterReset<Callback extends (...args: never[]) => unknown>(
    callback: Callback,
  ): Callback {
    return ((...args: never[]) => {
      if (hasBeenReset) throw new Error('The current callback cannot be called after reset');
      return callback.apply(null, args);
    }) as Callback;
  }

  function resetPropertyAccessor(
    origin: PropertyDescriptor | undefined,
    get: PropertyDescriptor['get'],
    set: PropertyDescriptor['set'],
  ) {
    hasBeenReset = true;

    const current = Object.getOwnPropertyDescriptor(target, key);
    if (!current || (get && current.get !== get) || (set && current.set !== set))
      // eslint-disable-next-line no-console
      console.error(`'${key}' changed since last rewrite.`);

    if (origin) Object.defineProperty(target, key, origin);
    else delete target[key];
  }
}
