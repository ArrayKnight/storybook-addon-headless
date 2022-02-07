import { Form } from '@storybook/components'
import { noCase } from 'change-case'
import React, { memo, useCallback } from 'react'

import { AnySchema, VariableType } from '../../types'
import { isNull, noopTransform } from '../../utilities'
import { BooleanInput } from './Boolean'
import { DateTimeInput } from './Date'
import { NumberInput } from './Number'
import { SelectInput } from './Select'
import { StringInput } from './String'
import { UnknownInput } from './Unknown'

export interface Props {
    name: string
    schema: AnySchema
    type: VariableType
    value: unknown
    error: string | null
    onChange: (name: string, value: unknown) => void
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
            [VariableType.Unknown]: UnknownInput,
        }[type]
        const change = useCallback(
            (value: unknown) => onChange(name, value),
            [name, onChange],
        )

        /* eslint-disable */
        return (
            <Form.Field label={label}>
                <Component // @ts-ignore
                    schema={schema} // @ts-ignore
                    value={value} // @ts-ignore
                    error={error} // @ts-ignore
                    isValid={isValid} // @ts-ignore
                    onChange={change} // @ts-ignore
                />
            </Form.Field>
        )
        /* eslint-enable */
    },
)

Variable.displayName = 'Variable'
