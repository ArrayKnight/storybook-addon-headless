import { action } from '@storybook/addon-actions'
import { object, withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import { Variables } from '.'
import { Dictionary } from '../../types'

export default {
    title: 'Variables',
}

export const VariablesStory = () => {
    const parameters = object('parameters', {
        query: 'https://server.mock/',
        variables: {
            Boolean: {
                type: 'boolean',
            },
            Float: {
                type: 'number',
                minimum: 1,
            },
            Integer: {
                type: 'integer',
                minimum: 0,
            },
            String: {
                type: 'string',
            },
        },
        defaults: {
            Float: 1.75,
            String: 'foo bar',
        },
    })

    function onFetch(variables: Dictionary): Promise<any> {
        action('onFetch')(variables)

        return Math.random() > 0.5 ? Promise.resolve() : Promise.reject()
    }

    return (
        <Variables
            hasData={false}
            hasError={false}
            parameters={parameters}
            onFetch={onFetch}
        />
    )
}

VariablesStory.story = {
    name: 'Parameters',
    decorators: [withKnobs],
}
