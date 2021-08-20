import MockNProgress from '../__mocks__/nprogress';
import { useNProgressConfig } from './useNProgressConfig';

afterEach(() => {
  MockNProgress.configure.mockClear();
});

describe('React Hook useNProgressConfig()', () => {
  it(' should exist', () => {
    expect(useNProgressConfig).toBeDefined();
  });

  it(' should return config without argument', () => {
    const ret = useNProgressConfig();
    expect(MockNProgress.configure).not.toBeCalled();
    expect(ret).toBe(MockNProgress.settings);
  });

  it(' should define config while argument received', () => {
    const config = {};
    const ret = useNProgressConfig(config);
    expect(MockNProgress.configure).toBeCalledTimes(1);
    expect(MockNProgress.configure).toBeCalledWith(config);
    expect(ret).toBeUndefined();
  });
});
