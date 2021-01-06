# Storybook Addon Headless

Storybook Addon Headless allows you to preview data from a headless CMS inside stories in [Storybook](https://storybook.js.org/). It supports Restful and GraphQL APIs with the help of [Axios](https://github.com/axios/axios) and [Apollo Client](https://github.com/apollographql/apollo-client) respectively. And each query can handle variables which are validated using [Ajv](https://github.com/epoberezkin/ajv).

### Upgrading to v2

_Dependencies **Storybook@6** and **Apollo@3** have been released!_

Be aware of the change to Storybook's story parameters, StoryContext (where `data` is accessed) is now the second parameter.

## Examples

Check out examples and detailed documentation:

-   [https://storybook-addon-headless.netlify.com/?path=/story/examples](https://storybook-addon-headless.netlify.com/?path=/story/examples)
-   [https://github.com/ArrayKnight/storybook-addon-headless/tree/master/src/examples](https://github.com/ArrayKnight/storybook-addon-headless/tree/master/src/examples)
-   [https://medium.com/arrayknight/how-to-get-real-data-into-storybook-8915f5371b6](https://medium.com/arrayknight/how-to-get-real-data-into-storybook-8915f5371b6)

|                                                  Headless                                                  |                                                  Story                                                  |
| :--------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| ![](https://raw.githubusercontent.com/ArrayKnight/storybook-addon-headless/master/src/assets/headless.png) | ![](https://raw.githubusercontent.com/ArrayKnight/storybook-addon-headless/master/src/assets/story.png) |

## Getting Started

#### Install

First of all, you need to install Headless into your project as a dev dependency.

```sh
npm install --save-dev storybook-addon-headless
```

#### Register

Then, configure it as an addon by adding it to your `addons.js` file (located in the Storybook config directory).

```js
import 'storybook-addon-headless'
```

Or to the `addons` parameter in your `main.js` file (located in the Storybook config directory).

```js
module.exports = {
    addons: ['storybook-addon-headless'],
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

You can find options documented as [HeadlessOptions](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types/options.ts) and on the [documentation site](https://storybook-addon-headless.netlify.com/?path=/story/options--page).

##### [Options](https://storybook-addon-headless.netlify.com/?path=/story/options--page)

```js
{
    graphql?: GraphQLOptionsTypes
    restful?: RestfulOptionsTypes
    jsonDark?: ReactJsonViewThemeKey
    jsonLight?: ReactJsonViewThemeKey
}
```

Under the covers, this addon uses Axios for Restful queries and Apollo Client for GraphQL queries. These configs are optional, though you'll likely want to use one or both. The configs will also be merged with the optional configs being passed through the parameters.

#### [Parameters](https://storybook-addon-headless.netlify.com/?path=/story/parameters--page)

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

You can find parameters document as [HeadlessParameters](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types/parameters.ts) and on the [documentation site](https://storybook-addon-headless.netlify.com/?path=/story/parameters--page).

```js
{
    headless: {
        [name]: HeadlessParameter,
        ...,
    }
}
```

`name` is the string to represent the query and data. It will be shown in the tab for the query and be the accessor on the data object in the story context.

`HeadlessParameter` represents several different possible options:

-   `string`: Restful URL
-   `PackedDocumentNode`: A `pack`ed GraphQL Tag `DocumentNode`
-   `GraphQLParameters`: [An object](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types/parameters.ts) with a `PackedDocumentNode` as a query and some optional parameters
-   `RestfulParameters`: [An object](https://github.com/ArrayKnight/storybook-addon-headless/blob/master/src/types/parameters.ts) with a Restful URL string as a query and some optional parameters

Due to the way a `DocumentNode` is converted to JSON, to maintain the original source query use the `pack` utility method.

#### [Components](https://storybook-addon-headless.netlify.com/?path=/story/components--page)

To help provide a better user experience, there are Prompt and Loader helper components provided.

These components are entirely optional, but will help to direct users to the Headless tab if necessary and provide feedback about the state of active API requests.

You can find basic usage in the [examples](https://github.com/ArrayKnight/storybook-addon-headless/tree/master/src/examples).

**Experimental** _(read: untested)_:

There are also two methods for those of you not using React, but wanting to use these helper components. `useHeadlessPrompt` and `useHeadlessLoader` will render the React components as standalone apps, but you must provide an HTML element reference that has been rendered and mounted by your framework of choice.

### Produced @ [GenUI](https://www.genui.com/)

This addon was developed while I was employed at GenUI, a software product development firm in Seattle, WA, USA. Interested in knowing more, starting a new project or working with us? Come check us out at [https://www.genui.com/](https://www.genui.com/)
