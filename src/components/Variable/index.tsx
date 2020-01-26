import { Form } from '@storybook/components'
import { noCase } from 'no-case'
import React, { memo } from 'react'

import {
    BooleanSchema,
    DateTimeSchema,
    NumberSchema,
    Schema,
    StringSchema,
    VariableType,
} from '../../types'
import { isNull } from '../../utilities'
import { BooleanInput } from './Boolean'
import { DateTimeInput } from './Date'
import { NumberInput } from './Number'
import { StringInput } from './String'
import { Row } from './styled'

export interface Props {
    name: string
    schema: Schema
    type: VariableType
    value: any
    error: string | null
    onChange: (value: any) => void
}

export const Variable = memo(
    ({ name, schema, type, value, error, onChange }: Props) => {
        const label = noCase(name, { transform: (_) => _ })
        const isValid = isNull(error)

        return (
            <Form.Field label={label}>
                {(() => {
                    switch (type) {
                        case VariableType.Boolean:
                            return (
                                <BooleanInput
                                    schema={schema as BooleanSchema}
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        case VariableType.Date:
                            return (
                                <DateTimeInput
                                    schema={schema as DateTimeSchema}
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        case VariableType.Number:
                            return (
                                <NumberInput
                                    schema={schema as NumberSchema}
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        case VariableType.String:
                            return (
                                <StringInput
                                    schema={schema as StringSchema}
                                    value={value}
                                    error={error}
                                    isValid={isValid}
                                    onChange={onChange}
                                />
                            )

                        default:
                            return (
                                <Row>
                                    <span>Unknown variable type</span>
                                </Row>
                            )
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
