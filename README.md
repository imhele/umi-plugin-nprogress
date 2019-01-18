# umi-plugin-nprogress

[![NPM version](https://img.shields.io/npm/v/umi-plugin-nprogress.svg?style=flat)](https://npmjs.org/package/umi-plugin-nprogress)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-nprogress.svg?style=flat)](https://npmjs.org/package/umi-plugin-nprogress)
[![Build Status](https://img.shields.io/travis/imhele/umi-plugin-nprogress.svg?style=flat)](https://travis-ci.org/imhele/umi-plugin-nprogress)
[![Coverage Status](https://coveralls.io/repos/github/imhele/umi-plugin-nprogress/badge.svg?branch=master)](https://coveralls.io/github/imhele/umi-plugin-nprogress?branch=master)
[![License](https://img.shields.io/npm/l/umi-plugin-nprogress.svg)](https://npmjs.org/package/umi-plugin-nprogress)

Add a top progress bar to your [Umi](https://github.com/umijs/umi) project.


## Usage
Before using `umi-plugin-nprogress` , please ensure you have enabled `dva`.

```sh
$ npm install umi-plugin-nprogress
or
$ yarn add umi-plugin-nprogress
```

Add `umi-plugin-nprogress` into `.umirc.js` or `config.js` of your `UmiJS` project. [UmiJS - Plugin usage](https://umijs.org/plugin/#plugin-usage)

```js
export default {
  plugins: [
    'umi-plugin-nprogress',
  ],
}
or
export default {
  plugins: [
    ['umi-plugin-nprogress', options],
  ],
}
```


## Options
### Overview

```ts
interface Options {
  configuration?: NProgressConfigureOptions;
  effects?: string[] | RegExp;
  enable?: boolean;
  global?: boolean;
  models?: string[] | RegExp;
  routeOnly?: boolean;
}
```


### configuration
Configure nprogress. [Link](https://github.com/rstacruz/nprogress#configuration)

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      configuration: {
        speed: 400,
        trickleSpeed: 100,
      },
    }],
  ],
}
```


### effects
Only the matched fields of `effects` will display the progress bar, while the others will not.

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      global: false,
      effects: /^user/,
    }],
  ],
}
```

### enable
Whether to enable this plugin.

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      enable: true,
    }],
  ],
}
```


### global
**default**: `true` 
Display the progress bar by listening to `loading.global`.

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      global: false,
    }],
  ],
}
```


### models
Only the matched fields of `models` will display the progress bar, while the others will not.

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      global: false,
      models: ['user'],
    }],
  ],
}
```


### routeOnly
**default**: `false` 
Whether to display the progress bar only when switching routes.

```js
export default {
  plugins: [
    ['umi-plugin-nprogress', {
      routeOnly: true,
    }],
  ],
}
```


## Example
Visit it at [example](https://github.com/imhele/umi-plugin-nprogress/tree/master/example)
