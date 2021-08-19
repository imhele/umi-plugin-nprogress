import MockNProgress from '../__mocks__/nprogress';
import { useNProgressConfig } from './useNProgressConfig';

describe('useNProgressConfig', () => {
  afterEach(() => {
    MockNProgress.configure.mockClear();
  });

  it(' should exist', () => {
    expect(useNProgressConfig).toBeDefined();
  });

  it(' should return config without argument', () => {
    const ret = useNProgressConfig();
    expect(MockNProgress.configure).not.toHaveBeenCalled();
    expect(ret).toBe(MockNProgress.settings);
  });

  it(' should define config while argument received', () => {
    const config = {};
    const ret = useNProgressConfig(config);
    expect(MockNProgress.configure).toHaveBeenCalledTimes(1);
    expect(MockNProgress.configure).toHaveBeenCalledWith(config);
    expect(ret).toBeUndefined();
  });
});
