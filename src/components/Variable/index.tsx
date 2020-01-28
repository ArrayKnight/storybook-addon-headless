import { Form } from '@storybook/components'
import { noCase } from 'no-case'
import React, { memo } from 'react'

import { Schema, VariableType } from '../../types'
import { isNull } from '../../utilities'
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
    value: any
    error: string | null
    onChange: (value: any) => void
}

type ComponentProps = Omit<Props, 'name' | 'type'> & { isValid: boolean }

export const Variable = memo(
    ({ name, schema, type, value, error, onChange }: Props) => {
        const label = noCase(name, { transform: (_) => _ })
        const isValid = isNull(error)
        const Component = {
            [VariableType.Boolean]: BooleanInput,
            [VariableType.Date]: DateTimeInput,
            [VariableType.Number]: NumberInput,
            [VariableType.Select]: SelectInput,
            [VariableType.String]: StringInput,
            [VariableType.Unknown]: ({}: ComponentProps) => (
                <Row>
                    <span>Unknown variable type</span>
                </Row>
            ),
        }[type]

        return (
            <Form.Field label={label}>
                <Component
                    schema={schema as any}
                    value={value as never}
                    error={error}
                    isValid={isValid}
                    onChange={onChange}
                />
            </Form.Field>
        )

        // TODO support more schemas:
        // (array of strings, numbers, mixed) => rows of inputs
        // (array of objects) => select
    },
)
