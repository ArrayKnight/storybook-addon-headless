import React, { ChangeEvent, memo } from 'react'

import type { BooleanSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: BooleanSchema
    value: boolean
    error: string | null
    isValid: boolean
    onChange: (value: boolean) => void
}

export const TEST_IDS = Object.freeze({
    root: 'BooleanRoot',
    input: 'BooleanInput',
    error: 'BooleanError',
})

export const BooleanInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(event.target.checked)
        }

        return (
            <Row data-testid={TEST_IDS.root}>
                <input
                    type="checkbox"
                    checked={value}
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

BooleanInput.displayName = 'Boolean'
