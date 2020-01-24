import { Form } from '@storybook/components'
import React, { ChangeEvent, memo } from 'react'

import { VariableType } from '../../types'
import { isNull } from '../../utilities'
import { Error, Row } from './styled'

const { Field, Input } = Form

interface Props {
    name: string
    type: VariableType
    value: any
    error: string | null
    onChange: (value: any) => void
}

export const Variable = memo(
    ({ name, type, value, error, onChange }: Props) => {
        const isBoolean = type === VariableType.Boolean
        const isNumber = type === VariableType.Number
        const isString = type === VariableType.String
        const isInvalid = !isNull(error)

        function update(event: ChangeEvent<HTMLInputElement>): void {
            switch (true) {
                case isBoolean:
                    return onChange(event.target.checked)

                case isNumber:
                    return onChange(parseFloat(event.target.value))

                case isString:
                    return onChange(event.target.value)
            }
        }

        return (
            <Field label={name.replace(/_/g, ' ')}>
                {(() => {
                    switch (true) {
                        case isBoolean:
                            return (
                                <Row>
                                    <input
                                        type="checkbox"
                                        checked={!!value}
                                        onChange={update}
                                    />
                                </Row>
                            )

                        case isNumber:
                        case isString:
                            return (
                                <Row>
                                    <Input
                                        type={isNumber ? 'number' : 'text'}
                                        valid={isInvalid ? 'error' : null}
                                        value={value}
                                        onChange={update}
                                    />
                                    {isInvalid && <Error>{error}</Error>}
                                </Row>
                            )

                        default:
                            return <></>
                    }
                })()}
            </Field>
        )

        // TODO support more schemas:
        // date
        // (array of strings, numbers, mixed) => rows of inputs
        // (array of objects) => select
    },
)
