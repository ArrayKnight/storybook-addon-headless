import { Form } from '@storybook/components'
// import { formatISO, parseISO } from 'date-fns'
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
        // const isTime = !includeDate && includeTime

        function getType(): string {
            return isDateTime ? 'datetime-local' : isDate ? 'date' : 'time'
        }

        function getter(val: string): string {
            if (!!val) {
                return val
            }

            return val
        }

        function setter(val: string): string {
            /*const date = isTime ? new Date() : parseISO(val)
            const representation = isDateTime
                ? 'complete'
                : isDate
                ? 'date'
                : 'time'

            if (isTime) {
                const [hours, minutes] = val.split(':')

                date.setHours(parseInt(hours, 10))
                date.setMinutes(parseInt(minutes, 10))
            }

            return formatISO(date, { representation })*/

            return val
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
