import { join } from 'path';

export default {
  plugins: [
    ['umi-plugin-react', {
      dva: true,
    }],
    [join(__dirname, '..', require('../package').main || 'index.js'), {
      configure: {
        speed: 400,
        trickleSpeed: 100,
      },
    }],
  ],
}
