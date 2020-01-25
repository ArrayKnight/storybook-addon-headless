import { action } from '@storybook/addon-actions'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import { Variable } from '.'
import { VariableType } from '../../types'

export default {
    title: 'Variable',
    component: Variable,
    decorators: [withKnobs],
}

export const BooleanStory = () => {
    const name = text('name', 'Boolean')
    const value = boolean('value', false)
    const error = text('error', '') || null

    return (
        <Variable
            name={name}
            type={VariableType.Boolean}
            value={value}
            error={error}
            onChange={action('onChange')}
        />
    )
}

BooleanStory.story = {
    name: 'Boolean',
}

export const NumberStory = () => {
    const name = text('name', 'Number')
    const value = number('value', NaN)
    const error = text('error', '') || null

    return (
        <Variable
            name={name}
            type={VariableType.Number}
            value={value}
            error={error}
            onChange={action('onChange')}
        />
    )
}

NumberStory.story = {
    name: 'Number',
}

export const StringStory = () => {
    const name = text('name', 'String')
    const value = text('value', '')
    const error = text('error', '') || null

    return (
        <Variable
            name={name}
            type={VariableType.String}
            value={value}
            error={error}
            onChange={action('onChange')}
        />
    )
}

StringStory.story = {
    name: 'String',
}
