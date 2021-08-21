const { createConfigItem } = require('@babel/core');
const { loadBabelConfig, loadCoreConfig, loadCoreConfigFiles } = require('wc-bundler');

const babel = loadBabelConfig(loadCoreConfig(loadCoreConfigFiles(undefined)).babel, {
  env: { targets: { node: '12' } },
  typescript: true,
});

makeBabelPluginConfigSerializable(babel.plugins);
makeBabelPluginConfigSerializable(babel.presets);

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  coveragePathIgnorePatterns: [/\/node_modules\//.source, /\/\S*fixture\S*\//.source],
  transform: { [/\.[jt]sx?$/.source]: ['babel-jest', babel] },
};

module.exports = config;

/**
 * Jest 启用 worker 执行测试用例时， babel 的 ConfigItem 无法被序列化传入 worker ，
 * 也无法通过缓存文件共享，因此需要转换一下。
 *
 * @param {import('@babel/core').PluginItem[]} plugins
 */
function makeBabelPluginConfigSerializable(plugins = []) {
  plugins.forEach((plugin, index) => {
    const { file = {}, name = [], options = {}, value } = createConfigItem(plugin);
    // undefined 会被序列化为 null ，无法通过 babel 校验，因此需要特殊处理一下
    plugins[index] = [file.resolved || value, options].concat(name);
  });
}
