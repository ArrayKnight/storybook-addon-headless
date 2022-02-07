import React, { memo, useMemo } from 'react'

import type { Item, SelectSchema } from '../../types'
import { convertToItem, isNull, isUndefined } from '../../utilities'
import { Select } from '../Select'
import { Error, Row } from './styled'

export interface Props {
    schema: SelectSchema
    value: unknown
    error: string | null
    isValid: boolean
    onChange: (value: unknown) => void
}

export const TEST_IDS = Object.freeze({
    root: 'SelectVariableRoot',
    input: 'SelectVariableInput',
    error: 'SelectVariableError',
})

export const SelectInput = memo(
    ({ schema, value, error, isValid, onChange }: Props) => {
        const items = useMemo(
            () => schema.enum.map(convertToItem),
            [schema.enum],
        )
        const selected = !isUndefined(value)
            ? items.find((item) => item.value === value)
            : value

        function update(item: Item | null): void {
            onChange(isNull(item) ? undefined : item.value)
        }

        return (
            <Row data-testid={TEST_IDS.root}>
                <Select
                    items={items}
                    selected={selected}
                    valid={!isValid ? 'error' : null}
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

SelectInput.displayName = 'Select'
