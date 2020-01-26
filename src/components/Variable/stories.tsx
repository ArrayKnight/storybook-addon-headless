import { action } from '@storybook/addon-actions'
import { text, withKnobs } from '@storybook/addon-knobs'
import React, { useState } from 'react'

import { VariableType } from '../../types'
import { Variable } from '.'

export default {
    title: 'Variable',
    component: Variable,
    decorators: [withKnobs],
}

export const BooleanStory = () => {
    const name = text('name', 'Boolean')
    const error = text('error', '') || null
    const [value, setValue] = useState(false)

    function onChange(val: boolean): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'boolean' }}
            type={VariableType.Boolean}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

BooleanStory.story = {
    name: 'Boolean',
}

export const DateStory = () => {
    const name = text('name', 'Date')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: string): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'string', format: 'date' }}
            type={VariableType.Date}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

DateStory.story = {
    name: 'Date',
}

export const DateTimeStory = () => {
    const name = text('name', 'DateTime')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: string): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'string', format: 'date-time' }}
            type={VariableType.Date}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

DateTimeStory.story = {
    name: 'DateTime',
}

export const TimeStory = () => {
    const name = text('name', 'Time')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: string): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'string', format: 'time' }}
            type={VariableType.Date}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

TimeStory.story = {
    name: 'Time',
}

export const FloatStory = () => {
    const name = text('name', 'Float')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: number): void {
        action('onChange')(val)

        setValue(`${val}`)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'number' }}
            type={VariableType.Number}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

FloatStory.story = {
    name: 'Float',
}

export const IntegerStory = () => {
    const name = text('name', 'Integer')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: number): void {
        action('onChange')(val)

        setValue(`${val}`)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'integer' }}
            type={VariableType.Number}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

IntegerStory.story = {
    name: 'Integer',
}

export const StringStory = () => {
    const name = text('name', 'String')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(val: string): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{ type: 'string' }}
            type={VariableType.String}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

StringStory.story = {
    name: 'String',
}
