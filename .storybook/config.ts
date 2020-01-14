import { addDecorator, configure } from '@storybook/react'

import { headlessDecorator } from '../dist'

addDecorator(
    headlessDecorator({
        graphql: {
            uri: 'https://metaphysics-production.artsy.net/',
        },
        restful: {
            baseURL: 'https://jsonplaceholder.typicode.com/',
        },
    }),
)

configure(require.context('../src', true, /stories\.tsx?$/), module)
