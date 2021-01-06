import { action } from '@storybook/addon-actions'
import { object, withKnobs } from '@storybook/addon-knobs'
import React, { ReactElement } from 'react'

import type { ApiParameters } from '../../types'
import { Variables } from '.'

export default {
    title: 'Variables',
    decorators: [withKnobs],
}

export const VariablesStory = (): ReactElement => {
    const parameters = object<ApiParameters>('parameters', {
        query: 'https://server.mock/',
        variables: {
            Boolean: {
                type: 'boolean',
            },
            Date: {
                type: 'string',
                format: 'date',
            },
            DateTime: {
                type: 'string',
                format: 'date-time',
            },
            Time: {
                type: 'string',
                format: 'time',
            },
            Float: {
                type: 'number',
                minimum: 1,
            },
            Integer: {
                type: 'integer',
                minimum: 0,
            },
            Select: {
                type: 'string',
                enum: [
                    'foo',
                    'bar',
                    'baz',
                    'wux',
                    'Lorem Ipsum',
                    { label: 'Item 6', value: '666' },
                ],
            },
            String: {
                type: 'string',
            },
        },
        defaults: {
            Float: 1.75,
            Select: '666',
            String: 'foo bar',
        },
    })

    function onFetch(variables: Record<string, unknown>): Promise<unknown> {
        action('onFetch')(variables)

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    resolve()
                } else {
                    reject()
                }
            }, 3000 * Math.random())
        })
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

VariablesStory.storyName = 'Parameters'
