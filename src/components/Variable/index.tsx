import { Form } from '@storybook/components'
import { noCase } from 'change-case'
import React, { memo } from 'react'

import { Schema, VariableType } from '../../types'
import { isNull, noopTransform } from '../../utilities'
import { BooleanInput } from './Boolean'
import { DateTimeInput } from './Date'
import { NumberInput } from './Number'
import { SelectInput } from './Select'
import { StringInput } from './String'
import { Row } from './styled'

export interface Props {
    name: string
    schema: Schema
    type: VariableType
    value: unknown
    error: string | null
    onChange: (value: unknown) => void
}

interface VariableProps extends Omit<Props, 'name'> {
    isValid: boolean
}

export const Variable = memo(
    ({ name, schema, type, value, error, onChange }: Props) => {
        const label = noCase(name, { transform: noopTransform })
        const isValid = isNull(error)
        const Component = {
            [VariableType.Boolean]: BooleanInput,
            [VariableType.Date]: DateTimeInput,
            [VariableType.Number]: NumberInput,
            [VariableType.Select]: SelectInput,
            [VariableType.String]: StringInput,
            [VariableType.Unknown]: memo(
                (props: VariableProps): JSX.Element => {
                    console.warn(`Unknown variable type. Props received: `, {
                        schema: props.schema,
                        value: props.value,
                    })

                    return (
                        <Row>
                            <span>Unknown variable type</span>
                        </Row>
                    )
                },
            ),
        }[type]

        /* eslint-disable */
        return (
            <Form.Field label={label}>
                <Component // @ts-ignore
                    schema={schema} // @ts-ignore
                    value={value} // @ts-ignore
                    error={error} // @ts-ignore
                    isValid={isValid} // @ts-ignore
                    onChange={onChange} // @ts-ignore
                />
            </Form.Field>
        )
        /* eslint-enable */
    },
)
