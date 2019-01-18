import 'jest';
import UmiPluginNprogress, { Options } from '../src/index';

jest.mock('fs');
jest.mock('mustache');

let options: Options;
let error: string[] = [];
let contextStore: object;
const config: {
  plugins: Array<string | [string] | [string, any]>;
} = {
  plugins: [],
};
const defaultContext: object = {
  modelsArr: false,
  effectsArr: false,
  modelsRegExp: false,
  effectsRegExp: false,
  enable: true,
  global: true,
  routeOnly: false,
  configuration: undefined,
};

export const setContext = (context: object) => {
  contextStore = context;
};

const UmiApi: object = {
  config,
  paths: {
    absTmpDirPath: __dirname,
  },
  log: {
    error: (message: string) => {
      error.push(message);
    },
  },
  addRendererWrapperWithComponent: (callback: () => string) => {
    return callback();
  },
  onOptionChange: (callback: (newOpts: Options) => void) => {
    callback(options);
  },
  rebuildTmpFiles: () => { },
};

describe('index.test.ts', () => {
  test('API exists', () => {
    expect(UmiPluginNprogress).toBeTruthy();
  });

  test('API work correctly', () => {
    config.plugins = ['umi-plugin-dva'];
    expect(() => {
      UmiPluginNprogress(UmiApi);
    }).not.toThrow();
    expect(contextStore).toMatchObject(defaultContext);
    options = {
      models: ['test'],
      effects: ['test/fetch'],
    };
    UmiPluginNprogress(UmiApi, options);
    expect(contextStore).toMatchObject({
      ...defaultContext,
      modelsArr: ['test'],
      effectsArr: ['test/fetch'],
    });
    options = {
      models: /test/i,
      effects: /test\/fetch/i,
    };
    UmiPluginNprogress(UmiApi, options);
    expect(contextStore).toMatchObject({
      ...defaultContext,
      modelsRegExp: '/test/i',
      effectsRegExp: '/test\\/fetch/i',
    });
  });

  test('Without umi-plugin-dva', () => {
    error = [];
    config.plugins = null;
    UmiPluginNprogress(UmiApi);
    expect(error.length).toBe(2);
    config.plugins = [['umi-plugin-react']];
    UmiPluginNprogress(UmiApi);
    expect(error.length).toBe(4);
    config.plugins = ['umi-plugin-oss'];
    UmiPluginNprogress(UmiApi);
    expect(error.length).toBe(6);
    config.plugins = [['umi-plugin-oss']];
    UmiPluginNprogress(UmiApi);
    expect(error.length).toBe(8);
    config.plugins = [['umi-plugin-react', { dva: true }]];
    UmiPluginNprogress(UmiApi);
    expect(error.length).toBe(8);
    UmiPluginNprogress(UmiApi, { enable: true });
    expect(error.length).toBe(8);
  });
});
