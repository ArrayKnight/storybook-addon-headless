import { Form } from '@storybook/components'
import { formatISO, parseISO } from 'date-fns'
import React, { ChangeEvent, memo } from 'react'

import { DateTimeSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: DateTimeSchema
    value: string
    error: string | null
    isValid: boolean
    onChange: (value: string) => void
}

export const DateTimeInput = memo(
    ({ schema, value, error, isValid, onChange }: Props) => {
        const includeDate = schema.format.startsWith('date')
        const includeTime = schema.format.endsWith('time')
        const isDate = includeDate && !includeTime
        const isDateTime = includeDate && includeTime
        const isTime = !includeDate && includeTime

        function getType(): string {
            return isDateTime ? 'datetime-local' : isDate ? 'date' : 'time'
        }

        function getDate(val: string, utc: boolean): Date {
            if (isTime) {
                const [hours, minutes] = val.split(':')
                const date = new Date()

                date[utc ? 'setUTCHours' : 'setHours'](
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    0,
                    0,
                )

                return date
            }

            return parseISO(val)
        }

        function getter(val: string): string {
            if (!val) {
                return val
            }

            const date = getDate(val, true)
            const representation = isDateTime
                ? 'complete'
                : isDate
                ? 'date'
                : 'time'

            return formatISO(date, { representation }).replace(
                /-\d{2}:\d{2}/,
                '',
            )
        }

        function setter(val: string): string {
            const date = getDate(val, false)
            const iso = date.toISOString()

            if (isDateTime) {
                return iso
            }

            const match = iso.match(/(\d{4}(?:-\d{2}){2})T(\d{2}:\d{2})/)
            const [, day, time] = match

            return isDate ? day : time
        }

        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(setter(event.target.value))
        }

        return (
            <Row>
                <Form.Input
                    type={getType()}
                    valid={!isValid ? 'error' : null}
                    value={getter(value)}
                    onChange={update}
                />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)
