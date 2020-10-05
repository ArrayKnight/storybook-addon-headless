import React, { memo } from 'react'

import { Row } from './styled'
import type { Props as VariableProps } from '.'

interface Props extends Omit<VariableProps, 'name'> {
    isValid: boolean
}

export const UnknownInput = memo(({ schema, value }: Props) => {
    console.warn(`Unknown variable type. Props received: `, {
        schema,
        value,
    })

    return (
        <Row>
            <span>Unknown variable type</span>
        </Row>
    )
})

UnknownInput.displayName = 'Unknown'
