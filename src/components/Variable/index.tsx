import { Form } from '@storybook/components'
import Ajv, { ValidateFunction } from 'ajv'
import React, { ChangeEvent, useEffect, useState } from 'react'

import { VariableState } from '../../types'
import { isNumberSchema, isStringSchema } from '../../utilities'
import { Error, Row } from './styled'

const { Field, Input } = Form
const ajv = new Ajv()

interface Props {
    name: string
    schema: object
    onChange: (state: VariableState) => void
}

export const Variable = ({ name, schema, onChange }: Props) => {
    const [valid, setValid] = useState(true)
    const [validate, setValidate] = useState<ValidateFunction>(() => () =>
        false,
    )
    const isNumber = isNumberSchema(schema)
    const isString = isStringSchema(schema)
    const [error] = validate.errors || []

    function onValueChange(value: any): void {
        const isValid = !!validate(value)

        setValid(isValid)

        onChange({
            value,
            isValid,
        })
    }

    function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const { value } = event.target

        onValueChange(isNumber ? parseFloat(value) : value)
    }

    useEffect(() => {
        setValidate(() => ajv.compile(schema))
    }, [])

    useEffect(() => {
        // TODO support default value?
        // TODO value will differ based on schema
        const value = ''

        onChange({
            value,
            isValid: !!validate(value),
        })
    }, [validate])

    return isNumber || isString ? (
        <Field label={name}>
            <Row>
                <Input
                    type={isNumber ? 'number' : 'string'}
                    valid={valid ? null : 'error'}
                    onChange={onInputChange}
                />
                {!valid && !!error && <Error>{error.message}</Error>}
            </Row>
        </Field>
    ) : null
    // TODO support more schemas:
    // boolean
    // date
    // (array of strings, numbers, mixed) => rows of inputs
    // (array of objects) => select
}
