import { action } from '@storybook/addon-actions'
import { text, withKnobs } from '@storybook/addon-knobs'
import React, { ReactElement, useState } from 'react'

import { VariableType } from '../../types'
import { Variable } from '.'

export default {
    title: 'Variable',
    component: Variable,
    decorators: [withKnobs],
}

export const BooleanStory = (): ReactElement => {
    const name = text('name', 'Boolean')
    const error = text('error', '') || null
    const [value, setValue] = useState(false)

    function onChange(_: string, val: boolean): void {
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

BooleanStory.storyName = 'Boolean'

export const DateStory = (): ReactElement => {
    const name = text('name', 'Date')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: string): void {
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

DateStory.storyName = 'Date'

export const DateTimeStory = (): ReactElement => {
    const name = text('name', 'DateTime')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: string): void {
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

DateTimeStory.storyName = 'DateTime'

export const TimeStory = (): ReactElement => {
    const name = text('name', 'Time')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: string): void {
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

TimeStory.storyName = 'Time'

export const FloatStory = (): ReactElement => {
    const name = text('name', 'Float')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: number): void {
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

FloatStory.storyName = 'Float'

export const IntegerStory = (): ReactElement => {
    const name = text('name', 'Integer')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: number): void {
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

IntegerStory.storyName = 'Integer'

export const SelectStory = (): ReactElement => {
    const name = text('name', 'Select')
    const error = text('error', '') || null
    const [value, setValue] = useState<
        boolean | null | number | string | undefined
    >(undefined)

    function onChange(_: string, val: boolean | null | number | string): void {
        action('onChange')(val)

        setValue(val)
    }

    return (
        <Variable
            name={name}
            schema={{
                type: ['boolean', 'null', 'number', 'string'],
                enum: [
                    true,
                    false,
                    null,
                    -3,
                    0,
                    9,
                    'foo',
                    'bar',
                    'Lorem Ipsum',
                    {
                        label: 'Item 10',
                        value: Infinity,
                    },
                ],
            }}
            type={VariableType.Select}
            value={value}
            error={error}
            onChange={onChange}
        />
    )
}

SelectStory.storyName = 'Select'

export const StringStory = (): ReactElement => {
    const name = text('name', 'String')
    const error = text('error', '') || null
    const [value, setValue] = useState('')

    function onChange(_: string, val: string): void {
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

StringStory.storyName = 'String'
