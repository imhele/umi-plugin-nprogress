import type { CoreConfig } from 'wc-bundler';

const config: CoreConfig = {
  cjs: {
    babel: {
      env: {
        targets: {
          chrome: '50',
          edge: '12',
          ie: '11',
          firefox: '50',
          safari: '10',
        },
      },
    },
  },
};

export default config;
