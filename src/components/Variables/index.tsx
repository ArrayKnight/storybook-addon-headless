import { Form } from '@storybook/components'
import React, { useState } from 'react'

import {
    ApiParameters,
    Dictionary,
    HeadlessParameter,
    VariableState,
} from '../../types'
import { isQuery, isString } from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form

interface Props {
    parameter: HeadlessParameter
    onFetch: (variables: Dictionary) => void
}

export const Variables = ({ parameter, onFetch }: Props) => {
    const config: ApiParameters =
        isString(parameter) || isQuery(parameter)
            ? ({ query: parameter, variables: {} } as ApiParameters)
            : parameter
    const variables = Object.entries(config.variables)
    const hasVariables = variables.length > 0
    const [valid, setValid] = useState(!hasVariables)
    const [values, setValues] = useState<Dictionary<VariableState>>(
        variables.reduce((states, [variable]) => {
            return {
                ...states,
                [variable]: {
                    value: '',
                    isValid: true,
                },
            }
        }, {}),
    )

    function onChange(name: string): (state: VariableState) => void {
        return (state) => {
            const states = {
                ...values,
                [name]: state,
            }

            setValues(states)

            if (hasVariables) {
                setValid(
                    variables.every(([variable]) => states[variable].isValid),
                )
            }
        }
    }

    function onClick(): void {
        onFetch(
            variables.reduce((vars, [variable]) => {
                return {
                    ...vars,
                    [variable]: values[variable].value,
                }
            }, {}),
        )
    }

    return (
        <>
            <Fieldset>
                {variables.map(([name, schema]) => (
                    <Variable
                        key={name}
                        name={name}
                        schema={schema}
                        onChange={onChange(name)}
                    />
                ))}
            </Fieldset>
            <Button disabled={!valid} onClick={onClick}>
                Fetch
            </Button>
        </>
    )
}
