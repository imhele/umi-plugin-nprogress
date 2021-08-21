import MockNProgress from '../__mocks__/nprogress';
import { Progress } from './progress';
import { setupFetch } from './setupFetch';

afterEach(() => {
  MockNProgress.done.mockClear();
  MockNProgress.start.mockClear();
});

describe('function setupFetch()', () => {
  it(' should exist', () => {
    expect(setupFetch).toBeDefined();
  });

  it(' should skip setup if fetch does not exist', () => {
    const target = Object.create(null);
    const reset = setupFetch(target, new Progress());
    expect(target).not.toHaveProperty('fetch');
    expect(reset).not.toThrow();
    expect(target).not.toHaveProperty('fetch');
  });

  it(' should rewrite fetch', async () => {
    const fetch = jest.fn();
    const [resolvedValue, rejectedValue] = [Symbol(), Symbol()];
    const target = Object.assign(Object.create(null), { fetch });

    const progress = new Progress(undefined, false);
    const reset = setupFetch(target, progress);
    expect(target).toHaveProperty('fetch', expect.any(Function));
    expect(target.fetch).not.toBe(fetch);

    fetch.mockReturnValue(Promise.resolve(resolvedValue));
    const resolved = target.fetch();
    expect(MockNProgress.done).toBeCalledTimes(0);
    expect(MockNProgress.start).toBeCalledTimes(1);

    await expect(resolved).resolves.toBe(resolvedValue);
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(1);

    fetch.mockReturnValue(Promise.reject(rejectedValue));
    const rejected = target.fetch();
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(2);

    await expect(rejected).rejects.toBe(rejectedValue);
    expect(MockNProgress.done).toBeCalledTimes(2);
    expect(MockNProgress.start).toBeCalledTimes(2);

    expect(reset).not.toThrow();
    expect(target).toHaveProperty('fetch', fetch);
  });
});
