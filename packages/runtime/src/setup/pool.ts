/**
 * 记录当前有多少请求正在执行中。
 */
export class PendingRequestPool {
  /**
   * 当前正在执行中的请求数量。
   */
  public get size(): number {
    return this.pool.size;
  }

  protected readonly pool = new Set<symbol>();

  /**
   * 新增一条记录。
   *
   * @returns 撤销此记录。
   */
  public allocate(): () => boolean {
    const key = Symbol();

    this.pool.add(key);

    return () => this.pool.delete(key);
  }
}
