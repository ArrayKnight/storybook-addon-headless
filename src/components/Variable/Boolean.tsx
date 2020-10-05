import React, { ChangeEvent, memo, useCallback } from 'react'

import type { BooleanSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: BooleanSchema
    value: boolean
    error: string | null
    isValid: boolean
    onChange: (value: boolean) => void
}

export const BooleanInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        const update = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.checked)
            },
            [onChange],
        )

        return (
            <Row>
                <input type="checkbox" checked={!!value} onChange={update} />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)

BooleanInput.displayName = 'Boolean'
