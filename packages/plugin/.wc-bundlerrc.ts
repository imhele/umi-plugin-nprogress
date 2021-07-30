import type { CoreConfig } from 'wc-bundler';

const config: CoreConfig = {
  babel: {
    env: { targets: { node: '10' } },
  },
};

export default config;
