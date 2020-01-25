import { Form } from '@storybook/components'
import { noCase } from 'no-case'
import React, { memo } from 'react'

import { VariableType } from '../../types'
import { isNull } from '../../utilities'
import { BooleanInput } from './Boolean'
import { NumberInput } from './Number'
import { StringInput } from './String'

export interface Props {
    name: string
    type: VariableType
    value: any
    error: string | null
    onChange: (value: any) => void
}

export const Variable = memo(
    ({ name, type, value, error, onChange }: Props) => {
        const isValid = isNull(error)

        return (
            <Form.Field label={noCase(name, { transform: (_) => _ })}>
                {(() => {
                    switch (true) {
                        case type === VariableType.Boolean:
                            return (
                                <BooleanInput
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        case type === VariableType.Number:
                            return (
                                <NumberInput
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        case type === VariableType.String:
                            return (
                                <StringInput
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        default:
                            return <></>
                    }
                })()}
            </Form.Field>
        )

        // TODO support more schemas:
        // date
        // (array of strings, numbers, mixed) => rows of inputs
        // (array of objects) => select
    },
)
