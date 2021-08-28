# umi-plugin-nprogress

[![NPM version](https://img.shields.io/npm/v/umi-plugin-nprogress.svg?style=flat)](https://npmjs.org/package/umi-plugin-nprogress) [![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-nprogress.svg?style=flat)](https://npmjs.org/package/umi-plugin-nprogress) [![Test Coverage](https://github.com/imhele/umi-plugin-nprogress/actions/workflows/Test%20Coverage.yml/badge.svg)](https://github.com/imhele/umi-plugin-nprogress/actions/workflows/Test%20Coverage.yml) [![Coverage Status](https://coveralls.io/repos/github/imhele/umi-plugin-nprogress/badge.svg?branch=master)](https://coveralls.io/github/imhele/umi-plugin-nprogress?branch=master) [![License](https://img.shields.io/npm/l/umi-plugin-nprogress.svg)](https://npmjs.org/package/umi-plugin-nprogress)

安装此插件，自动监听浏览器请求执行情况，以展示 NProgress 进度条。

## 用法

### 在 UmiJS 项目中使用

直接安装 `umi-plugin-nprogress` 到你的 UmiJS 项目即可，默认开启：

```shell
yarn add umi-plugin-nprogress --dev
# 或者
npm add umi-plugin-nprogress --save-dev
# 或者
pnpm add umi-plugin-nprogress --save-dev
```

### 动态配置或是获取 NProgress 配置

通常情况下，你可以直接[在插件中提供 NProgress 的配置](#ui)，如果你需要在运行时修改或者获取 NProgress 配置，可以从 `'umi'` 中导入 NProgress ：

```ts
import { NProgress } from 'umi';

NProgress.config({
  // 你想要修改的配置
});

// NProgress 当前的配置
console.log(NProgress.settings);
```

如果你的项目使用了 React ，还可以通过 React Hook 来修改或是获取 NProgress 配置：

```ts
import { useNProgressConfig } from 'umi';

export function MyComponent() {
  // NProgress 当前的配置
  const config = useNProgressConfig();

  useNProgressConfig({
    // 你想要修改的配置
  });

  return null;
}
```

### 获取 NProgress 实例

如果需要手动控制 NProgress ，可以从 `'umi'` 中导入 NProgress ：

```ts
import { NProgress } from 'umi';

NProgress.start();
NProgress.done();
```

### 在其他项目中使用

`umi-plugin-nprogress` 的核心运行时能力由 `umi-plugin-nprogress-runtime` 提供，而 `umi-plugin-nprogress-runtime` 无需依赖 UmiJS 即可运行，所以可以在非 UmiJS 项目中使用。

首先安装 `umi-plugin-nprogress-runtime` 到你的项目：

```shell
yarn add umi-plugin-nprogress-runtime
# 或者
npm add umi-plugin-nprogress-runtime
# 或者
pnpm add umi-plugin-nprogress-runtime
```

然后在项目的入口文件添加如下代码：

```ts
import { NProgress, setupNProgressPluginRuntime } from 'umi-plugin-nprogress-runtime';
// 引入 NProgress 样式，如果你确定不需要（例如自己定义了 NProgress 的渲染模板），则可以删除此行
import 'nprogress/nprogress.css';

// 如果默认配置即可满足需求，则无需调用此函数
NProgress.configure({
  // 添加你的 NProgress 配置
});

// 如果默认配置即可满足需求，直接 setupNProgressPluginRuntime() 即可
setupNProgressPluginRuntime({
  // 添加你的 runtime 配置
});
```

前面示例中，从 `'umi'` 导出的 `NProgress` 、 `useNProgressConfig` 等 API ，可以直接从 `'umi-plugin-nprogress-runtime'` 获取：

```diff
- import { NProgress, useNProgressConfig } from 'umi';
+ import { NProgress, useNProgressConfig } from 'umi-plugin-nprogress-runtime';
```

## 配置

### `ie11`

是否需要兼容到 IE 11 。

- 类型：`boolean | 'cjs' | 'esm' | undefined`
- 默认值：`false`

#### 说明

未启用此项时，默认兼容到 **chrome 67, edge 79, firefox 64, safari 12.1** ，启用此配置后将兼容到 **chrome 50, edge 12, ie 11, firefox 50, safari 10** 。

配置为 `'cjs'` 或是 `'esm'` 可指定走 CommonJS 还是 ESModule 产物，配置为 `true` 相当于 `'esm'` 。

如需兼容更低版本，请直接配置 umi-plugin-nprogress-runtime 依赖走 babel 编译。

#### 配置示例

```ts
// .umirc.ts
import { defineConfig } from 'umi';

export default defineConfig({
  nprogress: {
    ie11: true,
  },
});
```

### `runtime`

运行时的插件配置。

- 类型：`UmiPluginNProgressRuntimeConfig | undefined`
- 默认值：`undefined`

````ts
interface UmiPluginNProgressRuntimeConfig {
  /**
   * 启用对 XMLHttpRequest 的监听。
   *
   * @default
   * ```ts
   * true
   * ```
   */
  readonly XMLHttpRequest?: boolean;
  /**
   * 启用对 fetch 的监听。
   *
   * @default
   * ```ts
   * true
   * ```
   */
  readonly fetch?: boolean;
}
````

#### 配置示例

```ts
// .umirc.ts
import { defineConfig } from 'umi';

export default defineConfig({
  nprogress: {
    runtime: {
      // 关闭对 XMLHttpRequest 的监听
      XMLHttpRequest: false,
    },
  },
});
```

### `ui`

配置 nprogress 进度条的动效曲线、挂载容器、增速、渲染模板等样式。

- 类型：`NProgressConfigureOptions | undefined`
- 默认值：`undefined`

```ts
interface NProgressConfigureOptions {
  /**
   * 使用的 CSS 动效曲线，默认为 'ease' 。
   *
   * The CSS easing animation to use. Default is 'ease'.
   */
  readonly easing?: string;

  /**
   * 进度条最小的百分比，默认为 0.08 。
   *
   * The minimum progress percentage. Default is 0.08.
   */
  readonly minimum?: number;

  /**
   * 配置进度条 DOM 容器，需要是一个 CSS 选择器，默认为 'body' 。
   *
   * CSS selector to change the parent DOM element of the progress. Default is 'body'.
   */
  readonly parent?: string;

  /**
   * 是否在进度条出现时展示旋转的圆圈图标，默认展示。
   *
   * Whether to show the spinner. Default to true.
   */
  readonly showSpinner?: boolean;

  /**
   * 动画的速度（毫秒计），默认为 200 。
   *
   * The animation speed in milliseconds. Default is 200.
   */
  readonly speed?: number;

  /**
   * 进度条的 HTML 渲染模板，其中至少包含一个 HTML 属性 role 为 'bar' 的元素。
   *
   * The HTML markup inserted for the progress indicator. To keep the progress bar working, keep an element with role='bar' in there.
   */
  readonly template?: string;

  /**
   * 在展示进度条时，是否定时随机前进一点，默认启用。
   *
   * Whether to enable trickling the progress. Default is true.
   */
  readonly trickle?: boolean;

  /**
   * 进度条定时随机前进的间隔，默认为 800 。
   *
   * How often to trickle, in milliseconds. Default is 800.
   */
  readonly trickleSpeed?: number;
}
```

#### 配置示例

```ts
// .umirc.ts
import { defineConfig } from 'umi';

export default defineConfig({
  nprogress: {
    ui: {
      speed: 500,
    },
  },
});
```

### 完整配置示例

```ts
// .umirc.ts
import { defineConfig } from 'umi';

export default defineConfig({
  nprogress: {
    ie11: false,
    runtime: {
      fetch: false,
    },
    ui: {
      speed: 600,
    },
  },
});
```
