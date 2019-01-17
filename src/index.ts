import { join } from 'path';
import Mustache from 'mustache';
import { readFileSync, writeFileSync } from 'fs';

export interface Options {
  configuration?: NProgressConfigureOptions;
  effects?: string[] | RegExp;
  enable?: boolean;
  global?: boolean;
  models?: string[] | RegExp;
  routeOnly?: boolean;
}

const defaultOptions: Options = {
  enable: false,
  global: true,
  routeOnly: false,
};

const getOptions = (api: any, newOpts: Options) => {
  newOpts = {
    ...defaultOptions,
    ...newOpts,
  };
  if (newOpts.enable) {
    return newOpts;
  }
  const plugins: Array<string | [string, any]> = api.config.plugins;
  if (Array.isArray(plugins)) {
    newOpts.enable = plugins.some(plugin => {
      if (plugin === 'umi-plugin-dva') {
        return true;
      } else if (Array.isArray(plugin)) {
        if (plugin[0] === 'umi-plugin-react') {
          return (plugin[1] || {}).dva ? true : false;
        }
      }
      return false;
    });
  }
  if (!newOpts.enable) {
    api.log.error(
      `\nYou don't seem to have enabled dva, ` +
      `umi-plugin-nprogress can't work without dva for the moment.\n` +
      'You can set `enable: true` to force the umi-plugin-nprogress to work.',
    );
  }
  return newOpts;
};

export default (api: any, options: Options = {}): void => {
  options = getOptions(api, options);

  api.onOptionChange((newOpts: Options): void => {
    options = getOptions(api, newOpts);
    api.rebuildTmpFiles();
  });

  api.addRendererWrapperWithComponent(() => {
    const wrapperTpl = readFileSync(
      join(__dirname, '../template/Wrapper.js.mst'),
      'utf-8',
    );
    const modelsArr: string[] | false = Array.isArray(options.models) && options.models;
    const effectsArr: string[] | false = Array.isArray(options.effects) && options.effects;
    const modelsRegExp: string | false = options.models instanceof RegExp && options.models.toString();
    const effectsRegExp: string | false = options.effects instanceof RegExp && options.effects.toString();
    const wrapperContent = Mustache.render(wrapperTpl, {
      modelsArr,
      effectsArr,
      modelsRegExp,
      effectsRegExp,
      enable: options.enable,
      global: options.global,
      routeOnly: options.routeOnly,
      configuration: JSON.stringify(options.configuration, null, 0),
    });
    const wrapperPath = join(api.paths.absTmpDirPath, './NProgressWrapper.js');
    writeFileSync(wrapperPath, wrapperContent, 'utf-8');
    return wrapperPath;
  });
};
