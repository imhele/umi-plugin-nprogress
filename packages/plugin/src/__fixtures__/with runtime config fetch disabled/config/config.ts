import { defineConfig } from 'umi';
import type { UmiPluginNProgressConfig } from '../../../interfaces';

const nprogress: UmiPluginNProgressConfig = {
  runtime: {
    fetch: true,
    XMLHttpRequest: false,
  },
};

export default defineConfig({
  nprogress,
});
