import { Form } from '@storybook/components'
import { formatISO, parseISO } from 'date-fns'
import React, { ChangeEvent, memo } from 'react'

import type { DateTimeSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: DateTimeSchema
    value: string | undefined
    error: string | null
    isValid: boolean
    onChange: (value: string) => void
}

export enum DateTimeType {
    Date = 'date',
    DateTime = 'datetime-local',
    Time = 'time',
}

export function parseDateTime(
    val: string,
    type: DateTimeType,
    isUTC: boolean,
): Date {
    if (type === DateTimeType.Time) {
        const [hours, minutes] = val.split(':')
        const date = new Date()

        date[isUTC ? 'setUTCHours' : 'setHours'](
            parseInt(hours, 10),
            parseInt(minutes, 10),
            0,
            0,
        )

        return date
    }

    return parseISO(val)
}

export function toInputFormat(
    val: string | undefined,
    type: DateTimeType,
): string {
    if (!val) {
        return ''
    }

    const date = parseDateTime(val, type, true)
    const representation =
        type === DateTimeType.DateTime
            ? 'complete'
            : type === DateTimeType.Date
            ? 'date'
            : 'time'

    return formatISO(date, { representation }).replace(/-\d{2}:\d{2}.*/, '')
}

export function toISOFormat(val: string, type: DateTimeType): string {
    const date = parseDateTime(val, type, false)
    const iso = date.toISOString()

    if (type === DateTimeType.DateTime) {
        return iso
    }

    const match = /(\d{4}(?:-\d{2}){2})T(\d{2}(?::\d{2}){2})/.exec(iso)
    const [, day, time] = match

    return type === DateTimeType.Date ? day : time
}

export const TEST_IDS = Object.freeze({
    root: 'DateVariableRoot',
    input: 'DateVariableInput',
    error: 'DateVariableError',
})

export const DateTimeInput = memo(
    ({ schema, value, error, isValid, onChange }: Props) => {
        const includeDate = schema.format.startsWith('date')
        const includeTime = schema.format.endsWith('time')
        const type =
            includeDate && includeTime
                ? DateTimeType.DateTime
                : includeDate
                ? DateTimeType.Date
                : DateTimeType.Time

        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(toISOFormat(event.target.value, type))
        }

        return (
            <Row data-testid={TEST_IDS.root}>
                <Form.Input
                    type={type}
                    valid={!isValid ? 'error' : null}
                    value={toInputFormat(value, type)}
                    onChange={update}
                    data-testid={TEST_IDS.input}
                />
                {!isValid && error && (
                    <Error data-testid={TEST_IDS.error}>{error}</Error>
                )}
            </Row>
        )
    },
)

DateTimeInput.displayName = 'DateTime'
