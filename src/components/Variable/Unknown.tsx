import React, { memo } from 'react'

import { Row } from './styled'
import type { Props as VariableProps } from '.'

export interface Props extends Omit<VariableProps, 'name' | 'type'> {
    isValid: boolean
}

export const TEST_IDS = Object.freeze({
    root: 'UnknownVariableRoot',
})

export const MESSAGE = 'Unknown variable type'

export const UnknownInput = memo(({ schema, value }: Props) => {
    console.warn(MESSAGE, {
        schema,
        value,
    })

    return (
        <Row data-testid={TEST_IDS.root}>
            <span>{MESSAGE}</span>
        </Row>
    )
})

UnknownInput.displayName = 'Unknown'
