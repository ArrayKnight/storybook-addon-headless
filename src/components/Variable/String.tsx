import { Form } from '@storybook/components'
import React, { ChangeEvent, memo, useCallback } from 'react'

import type { StringSchema } from '../../types'
import { Error, Row } from './styled'

export interface Props {
    schema: StringSchema
    value: string | undefined
    error: string | null
    isValid: boolean
    onChange: (value: string) => void
}

export const StringInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        const update = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.value)
            },
            [onChange],
        )

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

StringInput.displayName = 'String'
