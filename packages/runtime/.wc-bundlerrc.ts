import type { BabelConfig, CoreConfig } from 'wc-bundler';

const ie11env: BabelConfig['env'] = {
  targets: {
    chrome: '50',
    edge: '12',
    ie: '11',
    firefox: '50',
    safari: '10',
  },
};

const config: CoreConfig = {
  cjs: [{}, { babel: { env: ie11env }, outdir: './ie11-lib' }],
  esm: [{}, { babel: { env: ie11env }, outdir: './ie11-es' }],
};

export default config;
