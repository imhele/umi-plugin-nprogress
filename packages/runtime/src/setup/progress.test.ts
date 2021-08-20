import MockNProgress from '../__mocks__/nprogress';
import { Progress } from './progress';

let setTimeoutSpy: jest.SpyInstance | undefined;
let clearTimeoutSpy: jest.SpyInstance | undefined;

beforeAll(() => {
  jest.useFakeTimers();

  setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');
  clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');
});

afterEach(() => {
  setTimeoutSpy?.mockClear();
  clearTimeoutSpy?.mockClear();

  MockNProgress.done.mockClear();
  MockNProgress.start.mockClear();
});

afterAll(() => {
  setTimeoutSpy?.mockRestore();
  clearTimeoutSpy?.mockRestore();

  jest.useRealTimers();
});

describe('Class Progress', () => {
  it(' should exist', () => {
    expect(Progress).toBeDefined();
  });

  it(' should update n-progress status after resolved / rejected / settled', () => {
    const progress = new Progress(0, false);

    let handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(0);
    expect(MockNProgress.start).toBeCalledTimes(1);

    handle.settle();
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(1);

    handle.settle();
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(1);

    handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(2);

    expect(handle.resolve('hello')).toBe('hello');
    expect(MockNProgress.done).toBeCalledTimes(2);
    expect(MockNProgress.start).toBeCalledTimes(2);

    expect(handle.resolve('world')).toBe('world');
    expect(MockNProgress.done).toBeCalledTimes(2);
    expect(MockNProgress.start).toBeCalledTimes(2);

    handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(2);
    expect(MockNProgress.start).toBeCalledTimes(3);

    expect(() => handle.reject('hello')).toThrow('hello');
    expect(MockNProgress.done).toBeCalledTimes(3);
    expect(MockNProgress.start).toBeCalledTimes(3);

    expect(() => handle.reject('world')).toThrow('world');
    expect(MockNProgress.done).toBeCalledTimes(3);
    expect(MockNProgress.start).toBeCalledTimes(3);
  });

  it(' should enable timeout by default', () => {
    const progress = new Progress();
    expect(progress.timeout).toBeGreaterThan(0);
  });

  it(' should clear handle after timeout', (done) => {
    const timeout = 10;
    const progress = new Progress(timeout, false);
    expect(progress.timeout).toBe(timeout);

    const handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(0);
    expect(MockNProgress.start).toBeCalledTimes(1);
    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toBeCalledWith(expect.any(Function), timeout);

    jest.runOnlyPendingTimers();
    expect(MockNProgress.done).toBeCalledTimes(1);

    handle.settle();
    expect(MockNProgress.done).toBeCalledTimes(1);
    done();
  });

  it(' should cancel the timeout callback after settled before the timeout', () => {
    const timeout = 10;
    const progress = new Progress(timeout, false);
    expect(progress.timeout).toBe(timeout);

    const handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(0);
    expect(MockNProgress.start).toBeCalledTimes(1);

    handle.settle();
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(clearTimeout).toBeCalledTimes(1);
  });

  it(' should merge duplicated update request in async mode', async () => {
    const progress = new Progress();

    const handle = progress.allocate();
    expect(MockNProgress.done).toBeCalledTimes(0);

    handle.settle();
    progress.check();
    expect(MockNProgress.done).toBeCalledTimes(0);
    await Promise.resolve();
    expect(MockNProgress.done).toBeCalledTimes(1);

    handle.settle();
    expect(MockNProgress.done).toBeCalledTimes(1);
    await Promise.resolve();
    expect(MockNProgress.done).toBeCalledTimes(1);

    progress.check();
    progress.check();
    expect(MockNProgress.done).toBeCalledTimes(1);
    await Promise.resolve();
    expect(MockNProgress.done).toBeCalledTimes(2);
  });
});
