import { Form } from '@storybook/components'
import React from 'react'

import { ApiParameters, HeadlessParameter } from '../../types'
import { isQuery, isString } from '../../utilities'
import { Field } from './styled'

const { Button, Input } = Form

interface Props {
    parameter: HeadlessParameter
}

export const Variables = ({ parameter }: Props) => {
    const config: ApiParameters =
        isString(parameter) || isQuery(parameter)
            ? ({ query: parameter, variables: {} } as ApiParameters)
            : parameter
    const variables = Object.entries(config.variables)

    return (
        <>
            {variables.map(([name, schema]) => {
                return (
                    <Field key={name} label={name}>
                        <Input />
                    </Field>
                )
            })}
            {!!variables.length && <Button disabled={true}>Submit</Button>}
        </>
    )
}
