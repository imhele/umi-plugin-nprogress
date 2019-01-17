import 'jest';
import UmiPluginNprogress, { Options } from '../src/index';

const defaultOptions: Options = {
  enable: true,
};

const UmiApi: object = {
  addRendererWrapperWithComponent: (callback: () => string) => {
    return callback();
  },
  onOptionChange: (callback: (newOpts: Options) => void) => {
    callback(defaultOptions);
  },
  rebuildTmpFiles: () => { },
};

describe('index.test.ts', () => {
  test('API exists', () => {
    expect(UmiPluginNprogress).toBeTruthy();
  });

  test('API work correctly', () => {
    expect(() => {
      UmiPluginNprogress(UmiApi, defaultOptions);
    }).not.toThrow();
  });
});
