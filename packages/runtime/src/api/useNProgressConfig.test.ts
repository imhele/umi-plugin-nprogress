import MockNProgress from './__mocks__/nprogress';
import { useNProgressConfig } from './useNProgressConfig';

describe('useNProgressConfig', () => {
  let received: unknown = undefined;

  beforeAll(() => {
    MockNProgress.configure.mockImplementationOnce((next) => (received = next)).mockReturnThis;
  });

  afterAll(() => {
    MockNProgress.configure.mockClear();
  });

  beforeEach(() => {
    received = undefined;
  });

  it(' should exist', () => {
    expect(useNProgressConfig).toBeDefined();
  });

  it(' should return config without argument', () => {
    const ret = useNProgressConfig();
    expect(received).toBeUndefined();
    expect(ret).toBe(MockNProgress.settings);
  });

  it(' should define config while argument received', () => {
    const config = {};
    const ret = useNProgressConfig(config);
    expect(ret).toBeUndefined();
    expect(received).toBe(config);
  });
});
