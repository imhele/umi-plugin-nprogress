import { PendingRequestPool } from './pool';

export interface RequestHandle {
  readonly reject: (input: unknown) => never;
  readonly resolve: <T>(input: T) => T;
  readonly settled: () => void;
}

/**
 * 管理所有请求的总进度，并根据请求执行情况展示 NProgress 进度条。
 */
export class Progress {
  /**
   * 请求发起后超过 timeout 则被认为超时。
   *
   * 设置为 0 或是负数时不生效。
   */
  public timeout: number;

  protected readonly pool = new PendingRequestPool();

  constructor(timeout = 60 * 1000) {
    this.timeout = timeout;
  }

  /**
   * 记录一次新的请求的发起。
   */
  public allocate(): RequestHandle {
    const revoke = this.pool.allocate();

    let handle: ReturnType<typeof setTimeout> | undefined;

    let ref: (() => void) | undefined = () => {
      ref = undefined;

      if (handle !== undefined) {
        clearTimeout(handle);
        handle = undefined;
      }

      revoke();
      this.check();
    };

    const reject: RequestHandle['reject'] = (input) => {
      if (ref) ref();
      throw input;
    };

    const resolve: RequestHandle['resolve'] = (input) => {
      if (ref) ref();
      return input;
    };

    const settled: RequestHandle['settled'] = () => {
      if (ref) ref();
    };

    if (this.timeout > 0) {
      handle = setTimeout(ref, this.timeout);
    }

    return { reject, resolve, settled };
  }

  /**
   * 检查当前是否存在未执行完成的请求记录，并更新 NProgress 状态。
   */
  public check(): boolean {
    if (!(this.pool.size > 0)) {
      NProgress.done();
      return false;
    }

    NProgress.start();
    return true;
  }
}
