import { defineConfig } from 'umi';
import type { UmiPluginNProgressConfig } from '../../../interfaces';

const nprogress: UmiPluginNProgressConfig = {
  ie11: 'esm',
};

export default defineConfig({
  nprogress,
});
