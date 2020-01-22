# Storybook Addon Headless

Storybook Addon Headless allows you to preview data from a headless CMS inside stories in [Storybook](https://storybook.js.org/). It supports Restful and GraphQL APIs with the help of [Axios](https://github.com/axios/axios) and [Apollo Client](https://github.com/apollographql/apollo-client) respectively. And each query can handle variables which are validated using [Ajv](https://github.com/epoberezkin/ajv).

## Examples

Check out examples and detailed documentation:

-   [https://storybook-addon-headless.netlify.com/](https://storybook-addon-headless.netlify.com/)
-   [https://github.com/ArrayKnight/storybook-addon-headless/tree/master/src/components/Examples](https://github.com/ArrayKnight/storybook-addon-headless/tree/master/src/components/Examples)

## Getting Started

#### Install

First of all, you need to install Headless into your project as a dev dependency.

```sh
npm install --save-dev storybook-addon-headless
```

#### Register

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory).

```js
import 'storybook-addon-headless/register'
```

Or to the `addons` parameter in your `main.js` file (located in the Storybook config directory).

```js
module.exports = {
    addons: ['storybook-addon-headless/register'],
    ...,
}
```

#### Decorate

Depending on the need of your project, you can either, add the `withHeadless` decorator:

-   Globally in `config.js` via `addDecorator(withHeadless({ ... }))`
-   Locally via `storiesOf('Name', module).addDecorator(withHeadless({ ... }))`
-   Locally to a story via CSF:

```js
export default {
    ...,
    decorators: [withHeadless({ ... })],
    ...,
}
```

You can find options documented as [HeadlessOptions](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types.ts#L18)

#### Parameterize

Parameters are added locally via:

-   `storiesOf('Name', module).addParameters({ headless: { ... } })`
-   `add(name, storyFn, { headless: { ... } })`
-   Via CSF:

```js
export default {
    ...,
    parameters: {
        headless: { ... }
    },
    ...,
}
```

You can find parameters document as [HeadlessParameters](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types.ts#L27)

### Produced @ [GenUI](https://www.genui.com/)

This addoon was developed while I was employed at GenUI, a software product development firm in Seattle, WA, USA. Interested in knowing more, starting a new project or working with us? Come check us out at [https://www.genui.com/](https://www.genui.com/)
