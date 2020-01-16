import { Form } from '@storybook/components'
import Ajv, { ValidateFunction } from 'ajv'
import React, { ChangeEvent, useEffect, useState } from 'react'

import { isNumberSchema, isStringSchema } from '../../utilities'

const { Field, Input } = Form
const ajv = new Ajv()

interface Props {
    name: string
    schema: object
}

export const Variable = ({ name, schema }: Props) => {
    const [valid, setValid] = useState(true)
    const [validate, setValidate] = useState<ValidateFunction>(() => () => true)
    const isNumber = isNumberSchema(schema)
    const isString = isStringSchema(schema)

    useEffect(() => {
        setValidate(() => ajv.compile(schema))
    }, [])

    function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const isValid = !!validate(event.target.value)

        setValid(isValid)
    }

    return isNumber || isString ? (
        <Field label={name}>
            <Input
                type={isNumber ? 'number' : 'string'}
                valid={valid ? null : 'error'}
                onChange={onInputChange}
            />
            {!valid && <span>{validate.errors[0].message}</span>}
        </Field>
    ) : null
    // TODO support more schemas:
    // boolean
    // date
    // (array of strings, numbers, mixed) => rows of inputs
    // (array of objects) => select
}
