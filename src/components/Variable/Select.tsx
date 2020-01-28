import React, { memo } from 'react'

import { SelectSchema } from '../../types'
import { Select } from '../Select'
import { Error, Row } from './styled'

export interface Props {
    schema: SelectSchema
    value: any
    error: string | null
    isValid: boolean
    onChange: (value: any) => void
}

export const SelectInput = memo(({ error, isValid }: Props) => {
    return (
        <Row>
            <Select items={[]} />
            {!isValid && <Error>{error}</Error>}
        </Row>
    )
})
