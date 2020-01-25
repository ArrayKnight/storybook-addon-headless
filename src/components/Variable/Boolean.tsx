import React, { ChangeEvent, memo } from 'react'

import { Error, Row } from './styled'

export interface Props {
    value: boolean
    error: string | null
    isValid: boolean
    onChange: (value: boolean) => void
}

export const BooleanInput = memo(
    ({ value, error, isValid, onChange }: Props) => {
        function update(event: ChangeEvent<HTMLInputElement>): void {
            onChange(event.target.checked)
        }

        return (
            <Row>
                <input type="checkbox" checked={!!value} onChange={update} />
                {!isValid && <Error>{error}</Error>}
            </Row>
        )
    },
)
