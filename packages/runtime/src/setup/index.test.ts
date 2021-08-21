const resetFetch = jest.fn();
const resetXMLHttpRequest = jest.fn();

const fakeWindowGetter = jest.fn();
const fakeWindow = Object.create(null);
let originalWindowDescriptor: PropertyDescriptor | undefined;

beforeAll(() => {
  jest.mock('./setupFetch', () => ({ setupFetch: jest.fn() }));
  jest.mock('./setupXMLHttpRequest', () => ({ setupXMLHttpRequest: jest.fn() }));

  originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
});

beforeEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    enumerable: true,
    get: fakeWindowGetter,
  });
});

afterEach(async () => {
  const [setupFetch, setupXMLHttpRequest] = await Promise.all([
    importSetupFetch(),
    importSetupXMLHttpRequest(),
  ]);

  resetFetch.mockClear();
  resetXMLHttpRequest.mockClear();
  setupFetch.mockClear().mockReturnValue(resetFetch);
  setupXMLHttpRequest.mockClear().mockReturnValue(resetXMLHttpRequest);
  fakeWindowGetter.mockClear().mockReturnValue(fakeWindow);
});

afterAll(() => {
  jest.unmock('./setupFetch');
  jest.unmock('./setupXMLHttpRequest');

  if (originalWindowDescriptor)
    Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
});

describe('function setupNProgressPluginRuntime()', () => {
  it(' should exist', async () => {
    const { setupNProgressPluginRuntime } = await import('./index');
    expect(setupNProgressPluginRuntime).toBeDefined();
  });

  it(' should skip setup if window does not exist', async () => {
    const { setupNProgressPluginRuntime } = await import('./index');

    fakeWindowGetter.mockReturnValue(undefined);
    expect(setupNProgressPluginRuntime).not.toThrow();
    expect(fakeWindowGetter).toBeCalledTimes(1);
  });

  it(' should complete setup fetch and XMLHttpRequest by default', async () => {
    const [{ setupNProgressPluginRuntime }, setupFetch, setupXMLHttpRequest] = await Promise.all([
      import('./index'),
      importSetupFetch(),
      importSetupXMLHttpRequest(),
    ]);

    const reset = setupNProgressPluginRuntime();
    expect(setupFetch).toBeCalledTimes(1);
    expect(resetFetch).toBeCalledTimes(0);
    expect(setupXMLHttpRequest).toBeCalledTimes(1);
    expect(resetXMLHttpRequest).toBeCalledTimes(0);
    expect(reset).not.toThrow();
    expect(setupFetch).toBeCalledTimes(1);
    expect(resetFetch).toBeCalledTimes(1);
    expect(setupXMLHttpRequest).toBeCalledTimes(1);
    expect(resetXMLHttpRequest).toBeCalledTimes(1);
  });

  it(' should skip setup if disabled', async () => {
    const [{ setupNProgressPluginRuntime }, setupFetch, setupXMLHttpRequest] = await Promise.all([
      import('./index'),
      importSetupFetch(),
      importSetupXMLHttpRequest(),
    ]);

    const reset = setupNProgressPluginRuntime({ XMLHttpRequest: false, fetch: false });
    expect(setupFetch).toBeCalledTimes(0);
    expect(resetFetch).toBeCalledTimes(0);
    expect(setupXMLHttpRequest).toBeCalledTimes(0);
    expect(resetXMLHttpRequest).toBeCalledTimes(0);
    expect(reset).not.toThrow();
    expect(setupFetch).toBeCalledTimes(0);
    expect(resetFetch).toBeCalledTimes(0);
    expect(setupXMLHttpRequest).toBeCalledTimes(0);
    expect(resetXMLHttpRequest).toBeCalledTimes(0);
  });

  it(' should reset first if setup has been invoked', async () => {
    const [{ setupNProgressPluginRuntime }, setupFetch] = await Promise.all([
      import('./index'),
      importSetupFetch(),
    ]);

    setupNProgressPluginRuntime({ fetch: true });
    expect(setupFetch).toBeCalledTimes(1);
    expect(resetFetch).toBeCalledTimes(0);

    fakeWindowGetter.mockReturnValue(undefined);
    const reset = setupNProgressPluginRuntime({ fetch: true });
    expect(setupFetch).toBeCalledTimes(1);
    expect(resetFetch).toBeCalledTimes(1);
    expect(reset).not.toThrow();
    expect(setupFetch).toBeCalledTimes(1);
    expect(resetFetch).toBeCalledTimes(1);
  });
});

describe('function resetNProgressPluginRuntime()', () => {
  it(' should exist', async () => {
    const { resetNProgressPluginRuntime } = await import('./index');
    expect(resetNProgressPluginRuntime).toBeDefined();
  });

  it(' should skip reset if setup has not been invoked', async () => {
    const { resetNProgressPluginRuntime } = await import('./index');
    expect(resetNProgressPluginRuntime()).toBe(false);
  });

  it(' should reset if setup has been invoked', async () => {
    const { resetNProgressPluginRuntime, setupNProgressPluginRuntime } = await import('./index');
    setupNProgressPluginRuntime();
    expect(resetNProgressPluginRuntime()).toBe(true);
    expect(resetNProgressPluginRuntime()).toBe(false);
  });
});

function importSetupFetch(): Promise<jest.Mock> {
  return importMockFunction('./setupFetch', 'setupFetch');
}

function importSetupXMLHttpRequest(): Promise<jest.Mock> {
  return importMockFunction('./setupXMLHttpRequest', 'setupXMLHttpRequest');
}

async function importMockFunction(from: string, field: string): Promise<jest.Mock> {
  return (await import(from))[field];
}
