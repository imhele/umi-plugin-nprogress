import { rewriteValue } from './rewriteValue';

describe('function rewriteValue()', () => {
  it('should exist', () => {
    expect(rewriteValue).toBeDefined();
  });

  it('should correctly rewrite non-existent property', () => {
    const target = Object.create(null);
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const createValue = jest.fn().mockReturnValue(objectValue);

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(undefined);

    target[key] = symbolValue;
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should correctly rewrite existent writable property', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, {
      [key]: { configurable: true, writable: true, value: symbolValue },
    });

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    target[key] = null;
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue.mock.calls[0][0]()).toEqual(null);

    reset();
    expect(target).toHaveProperty(key, null);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should correctly rewrite existent un-writable property', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, { [key]: { configurable: true, value: symbolValue } });

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    target[key] = null;
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should correctly rewrite the property with only the setter', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const setter = jest.fn();
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, { [key]: { configurable: true, set: setter } });

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(undefined);

    target[key] = symbolValue;
    expect(target).toHaveProperty(key, objectValue);
    expect(setter).toBeCalledTimes(1);
    expect(setter).toBeCalledWith(symbolValue);
    expect(createValue.mock.calls[0][0]()).toEqual(undefined);

    reset();
    expect(target).toHaveProperty(key, undefined);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should directly rewrite the property with accessor', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const setter = jest.fn().mockReturnValue(true);
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, {
      [key]: { configurable: true, get: () => symbolValue, set: setter },
    });

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    target[key] = null;
    expect(target).toHaveProperty(key, objectValue);
    expect(setter).toBeCalledTimes(1);
    expect(setter).toBeCalledWith(null);
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should directly rewrite non-configurable property', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, { [key]: { value: symbolValue, writable: true } });

    const reset = rewriteValue(target, key, createValue);
    expect(target).toHaveProperty(key, objectValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(createValue.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(createValue.mock.calls[0][0]()).toEqual(symbolValue);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should ignore non-configurable un-writable property', () => {
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];
    const createValue = jest.fn().mockReturnValue(objectValue);
    const target = Object.create(null, { [key]: { value: symbolValue } });

    const reset = rewriteValue(target, key, createValue);
    expect(createValue).toBeCalledTimes(1);
    expect(createValue).toBeCalledWith(expect.any(Function));
    expect(target).toHaveProperty(key, symbolValue);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(reset).toThrow();
    expect(createValue.mock.calls[0][0]).toThrow();
  });

  it('should warn of undesired attribute contamination', () => {
    const consoleError = console.error;
    const mockConsoleError = (console.error = jest.fn());

    const target = Object.create(null);
    const [key, objectValue, symbolValue] = ['key', {}, Symbol()];

    let reset = rewriteValue(target, key, () => objectValue);
    expect(target).toHaveProperty(key, objectValue);
    Object.defineProperty(target, key, { configurable: true, value: symbolValue });
    expect(target).toHaveProperty(key, symbolValue);

    reset();
    expect(target).not.toHaveProperty(key);
    expect(mockConsoleError).toBeCalledTimes(1);
    expect(mockConsoleError).toBeCalledWith(expect.any(String));
    mockConsoleError.mockClear();

    Object.defineProperty(target, key, { configurable: true, get: () => symbolValue });
    reset = rewriteValue(target, key, () => objectValue);
    expect(target).toHaveProperty(key, objectValue);
    Object.defineProperty(target, key, { configurable: true, value: null });
    expect(target).toHaveProperty(key, null);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(mockConsoleError).toBeCalledTimes(1);
    expect(mockConsoleError).toBeCalledWith(expect.any(String));
    mockConsoleError.mockClear();

    Object.defineProperty(target, key, { configurable: false, value: symbolValue, writable: true });
    reset = rewriteValue(target, key, () => objectValue);
    expect(target).toHaveProperty(key, objectValue);
    target[key] = null;
    expect(target).toHaveProperty(key, null);

    reset();
    expect(target).toHaveProperty(key, symbolValue);
    expect(mockConsoleError).toBeCalledTimes(1);
    expect(mockConsoleError).toBeCalledWith(expect.any(String));
    mockConsoleError.mockClear();

    console.error = consoleError;
  });
});
