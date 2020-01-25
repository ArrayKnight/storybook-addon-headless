import { Form } from '@storybook/components'
import React, { ChangeEvent, memo } from 'react'

import { Error, Row } from './styled'

export interface Props {
    value: number
    error: string | null
    isValid: boolean
    onChange: (value: number) => void
}

export const NumberInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(parseFloat(event.target.value))
        }

        return (
            <Row>
                <Form.Input
                    type="number"
                    valid={!isValid ? 'error' : null}
                    value={value}
                    onChange={update}
                />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)
