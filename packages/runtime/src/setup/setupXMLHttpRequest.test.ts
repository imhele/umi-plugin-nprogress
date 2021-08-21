import { EventEmitter } from 'events';
import MockNProgress from '../__mocks__/nprogress';
import { Progress } from './progress';
import { setupXMLHttpRequest } from './setupXMLHttpRequest';

afterEach(() => {
  MockNProgress.done.mockClear();
  MockNProgress.start.mockClear();
});

describe('function setupXMLHttpRequest()', () => {
  it(' should exist', () => {
    expect(setupXMLHttpRequest).toBeDefined();
  });

  it(' should skip setup if XMLHttpRequest does not exist', () => {
    const target = Object.create(null);
    const reset = setupXMLHttpRequest(target, new Progress());
    expect(target).not.toHaveProperty('XMLHttpRequest');
    expect(reset).not.toThrow();
    expect(target).not.toHaveProperty('XMLHttpRequest');
  });

  it(' should rewrite XMLHttpRequest', () => {
    const [argument, returnValue] = [Symbol(), Symbol()];
    const [emitter, fakeEventTarget] = createFakeEventTarget();

    const send = jest.fn().mockReturnValue(returnValue);
    const prototype = Object.assign(fakeEventTarget, { send });
    const XMLHttpRequest = Object.assign(Object.create(null), { prototype });
    const target = Object.assign(Object.create(null), { XMLHttpRequest });

    const progress = new Progress(undefined, false);
    const reset = setupXMLHttpRequest(target, progress);
    expect(target).toHaveProperty('XMLHttpRequest', XMLHttpRequest);
    expect(XMLHttpRequest).toHaveProperty('prototype', prototype);
    expect(prototype).toHaveProperty('send', expect.any(Function));
    expect(prototype.send).not.toBe(send);

    expect(prototype.send(argument)).toBe(returnValue);
    expect(send).toBeCalledTimes(1);
    expect(send).toBeCalledWith(argument);
    expect(send.mock.instances[0]).toBe(prototype);

    expect(MockNProgress.done).toBeCalledTimes(0);
    expect(MockNProgress.start).toBeCalledTimes(1);
    expect(emitter.eventNames()).toEqual(['loadend']);
    expect(emitter.listenerCount('loadend')).toBe(1);

    expect(() => emitter.emit('loadend')).not.toThrow();
    expect(emitter.listenerCount('loadend')).toBe(0);
    expect(MockNProgress.done).toBeCalledTimes(1);
    expect(MockNProgress.start).toBeCalledTimes(1);

    expect(reset).not.toThrow();
    expect(prototype).toHaveProperty('send', send);
  });
});

function createFakeEventTarget(): [emitter: EventEmitter, fakeEventTarget: EventTarget] {
  const emitter = new EventEmitter();

  const fakeEventTarget: EventTarget = {
    addEventListener(type, listener) {
      if (!listener) return;
      listener = typeof listener === 'function' ? listener : listener.handleEvent;
      emitter.addListener(type, listener);
    },
    dispatchEvent(event) {
      emitter.emit(event.type, event);
      return !event.cancelable || !event.defaultPrevented;
    },
    removeEventListener(type, listener) {
      if (!listener) return;
      listener = typeof listener === 'function' ? listener : listener.handleEvent;
      emitter.removeListener(type, listener);
    },
  };

  return [emitter, Object.assign(Object.create(null), fakeEventTarget)];
}
