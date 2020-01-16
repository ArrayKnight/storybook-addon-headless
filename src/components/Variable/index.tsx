import { Form } from '@storybook/components'
import Ajv, { ValidateFunction } from 'ajv'
import React, { ChangeEvent, useEffect, useState } from 'react'

import { VariableState } from '../../types'
import { isNumberSchema, isStringSchema } from '../../utilities'

const { Field, Input } = Form
const ajv = new Ajv()

interface Props {
    name: string
    schema: object
    onChange: (state: VariableState) => void
}

export const Variable = ({ name, schema, onChange: notifyOnChange }: Props) => {
    const [valid, setValid] = useState(true)
    const [validate, setValidate] = useState<ValidateFunction>(() => () =>
        false,
    )
    const isNumber = isNumberSchema(schema)
    const isString = isStringSchema(schema)
    const [error] = validate.errors || []

    function onChange(value: any): void {
        const isValid = !!validate(value)

        setValid(isValid)

        notifyOnChange({
            value,
            isValid,
        })
    }

    function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const { value } = event.target

        onChange(isNumber ? parseFloat(value) : value)
    }

    useEffect(() => {
        setValidate(() => ajv.compile(schema))
    }, [])

    useEffect(() => {
        // TODO support default value?
        // TODO value will differ based on schema
        const value = ''

        notifyOnChange({
            value,
            isValid: !!validate(value),
        })
    }, [validate])

    return isNumber || isString ? (
        <Field label={name}>
            <Input
                type={isNumber ? 'number' : 'string'}
                valid={valid ? null : 'error'}
                onChange={onInputChange}
            />
            {!valid && !!error && <span>{error.message}</span>}
        </Field>
    ) : null
    // TODO support more schemas:
    // boolean
    // date
    // (array of strings, numbers, mixed) => rows of inputs
    // (array of objects) => select
}
