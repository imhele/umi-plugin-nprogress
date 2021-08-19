import { NProgress } from '../api';
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
   * 异步更新 NProgress 的进度条，减少对请求的阻塞。
   */
  public async: boolean;

  /**
   * 请求发起后超过 timeout 则被认为超时。
   *
   * 设置为 0 或是负数时不生效。
   */
  public timeout: number;

  protected checking?: Promise<boolean>;

  protected readonly pool = new PendingRequestPool();

  constructor(timeout = 60 * 1000, async = true) {
    this.async = async;
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

    this.check();

    return { reject, resolve, settled };
  }

  /**
   * 请求检查当前是否存在未执行完成的请求记录，并更新 NProgress 状态。
   *
   * - 当 async 为 true 时，将在下一个微任务中进行检查。
   *   如果当前已经存在暂未执行的微任务，不会重复创建。
   * - 当 async 为 false 时，立即执行检查。
   */
  public check(): Promise<boolean> | boolean {
    if (this.async) {
      this.checking ||= Promise.resolve().then(() => {
        this.checking = undefined;
        return this.checkImmediately();
      });

      return this.checking;
    }

    return this.checkImmediately();
  }

  /**
   * 检查当前是否存在未执行完成的请求记录，并更新 NProgress 状态。
   */
  public checkImmediately(): boolean {
    if (!(this.pool.size > 0)) {
      NProgress.done();
      return false;
    }

    NProgress.start();
    return true;
  }
}
