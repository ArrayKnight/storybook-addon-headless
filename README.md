# Storybook Addon Headless

Storybook Addon Headless allows you to preview data from a headless CMS inside stories in [Storybook](https://storybook.js.org/).

## Getting Started

First of all, you need to install Headless into your project as a dev dependency.

```sh
npm i --save-dev storybook-addon-headless
```

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory).

```js
import 'storybook-addon-headless/register'
```
