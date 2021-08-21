import { defineConfig } from 'umi';
import type { UmiPluginNProgressConfig } from '../../../interfaces';

const nprogress: UmiPluginNProgressConfig = {
  ie11: 'cjs',
};

export default defineConfig({
  nprogress,
});
