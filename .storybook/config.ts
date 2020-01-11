import { addDecorator, configure } from '@storybook/react'

import { headlessDecorator } from '../dist'

addDecorator(
    headlessDecorator({
        graphQL: {
            uri: 'https://countries.trevorblades.com/',
        },
    }),
)

configure(require.context('../src', true, /stories\.tsx?$/), module)
