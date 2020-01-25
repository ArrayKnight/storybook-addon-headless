import { Form } from '@storybook/components'
import React, { ChangeEvent, memo } from 'react'

import { Error, Row } from './styled'

export interface Props {
    value: string
    error: string | null
    isValid: boolean
    onChange: (value: string) => void
}

export const StringInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(event.target.value)
        }

        return (
            <Row>
                <Form.Input
                    type="text"
                    valid={!isValid ? 'error' : null}
                    value={value}
                    onChange={update}
                />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)
