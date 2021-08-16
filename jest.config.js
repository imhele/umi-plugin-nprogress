const { loadBabelConfig, loadCoreConfig, loadCoreConfigFiles } = require('wc-bundler');

const babel = loadBabelConfig(loadCoreConfig(loadCoreConfigFiles(undefined)).babel, {
  env: { targets: { node: '12' } },
  typescript: true,
});

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: { [/\.[jt]sx?$/.source]: ['babel-jest', babel] },
};

module.exports = config;
