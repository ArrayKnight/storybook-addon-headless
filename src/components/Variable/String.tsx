import { Form } from '@storybook/components'
import React, { ChangeEvent, memo } from 'react'

import type { StringSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: StringSchema
    value: string | undefined
    error: string | null
    isValid: boolean
    onChange: (value: string) => void
}

export const TEST_IDS = Object.freeze({
    root: 'StringVariableRoot',
    input: 'StringVariableInput',
    error: 'StringVariableError',
})

export const StringInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(event.target.value)
        }

        return (
            <Row data-testid={TEST_IDS.root}>
                <Form.Input
                    type="text"
                    valid={!isValid ? 'error' : null}
                    value={value || ''}
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

StringInput.displayName = 'String'
