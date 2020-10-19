import { Form } from '@storybook/components'
import React, { ChangeEvent, memo } from 'react'

import type { NumberSchema } from '../../types'
import { isUndefined } from '../../utilities'
import { Error, Row } from './styled'

export interface Props {
    schema: NumberSchema
    value: number | undefined
    error: string | null
    isValid: boolean
    onChange: (value: number) => void
}

export const TEST_IDS = Object.freeze({
    root: 'NumberRoot',
    input: 'NumberInput',
    error: 'NumberError',
})

export const NumberInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(parseFloat(event.target.value))
        }

        return (
            <Row data-testid={TEST_IDS.root}>
                <Form.Input
                    type="number"
                    valid={!isValid ? 'error' : null}
                    value={isUndefined(value) ? '' : `${value}`}
                    onChange={update}
                    data-testid={TEST_IDS.input}
                />
                {!isValid && (
                    <Error data-testid={TEST_IDS.error}>{error}</Error>
                )}
            </Row>
        )
    },
)

NumberInput.displayName = 'Number'
