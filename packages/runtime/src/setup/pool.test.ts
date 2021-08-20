import { PendingRequestPool } from './pool';

describe('class PendingRequestPool', () => {
  it(' should exist', () => {
    expect(PendingRequestPool).toBeDefined();
  });

  it(' should count allocations', () => {
    const pool = new PendingRequestPool();
    expect(pool.size).toBe(0);

    const revoke = [pool.allocate()];
    expect(pool.size).toBe(1);

    revoke.push(pool.allocate());
    expect(pool.size).toBe(2);

    revoke[0]();
    expect(pool.size).toBe(1);

    revoke[0]();
    expect(pool.size).toBe(1);

    revoke[1]();
    expect(pool.size).toBe(0);
  });
});
