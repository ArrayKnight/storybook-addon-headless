import { Form } from '@storybook/components'
import React, { ChangeEvent, memo, useCallback } from 'react'

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

export const NumberInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        const update = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                onChange(parseFloat(event.target.value))
            },
            [onChange],
        )

        return (
            <Row>
                <Form.Input
                    type="number"
                    valid={!isValid ? 'error' : null}
                    value={isUndefined(value) ? '' : `${value}`}
                    onChange={update}
                />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)

NumberInput.displayName = 'Number'
