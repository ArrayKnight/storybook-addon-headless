import React, { memo, useCallback } from 'react'

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

export const SelectInput = memo(
    ({ schema, value, error, isValid, onChange }: Props) => {
        const items = schema.enum.map(convertToItem)
        const selected = isUndefined(value)
            ? value
            : items.find((item) => item.value === value)
        const update = useCallback(
            (item: Item | null) => {
                onChange(isNull(item) ? undefined : item.value)
            },
            [onChange],
        )

        return (
            <Row>
                <Select
                    items={items}
                    selected={selected}
                    valid={!isValid ? 'error' : null}
                    onChange={update}
                />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)

SelectInput.displayName = 'Select'
