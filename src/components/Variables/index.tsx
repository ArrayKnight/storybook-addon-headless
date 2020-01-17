import { Form, Icons } from '@storybook/components'
import React, { useState } from 'react'

import {
    ApiParameters,
    Dictionary,
    FetchStatus,
    HeadlessParameter,
    VariableState,
} from '../../types'
import { isQuery, isString } from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form

interface Props {
    parameter: HeadlessParameter
    onFetch: (variables: Dictionary) => Promise<any>
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
        variables.reduce(
            (states, [variable]) => ({
                ...states,
                [variable]: {
                    value: '',
                    isValid: true,
                },
            }),
            {},
        ),
    )
    const [status, setStatus] = useState(FetchStatus.Inactive)
    const { inactive, loading, rejected } = {
        inactive: status === FetchStatus.Inactive,
        loading: status === FetchStatus.Loading,
        rejected: status === FetchStatus.Rejected,
    }

    function onChange(name: string): (state: VariableState) => void {
        return (state) => {
            const states = {
                ...values,
                [name]: state,
            }

            setStatus(FetchStatus.Inactive)

            setValues(states)

            if (hasVariables) {
                setValid(
                    variables.every(([variable]) => states[variable].isValid),
                )
            }
        }
    }

    function onClick(): void {
        setStatus(FetchStatus.Loading)

        onFetch(
            variables.reduce(
                (vars, [variable]) => ({
                    ...vars,
                    [variable]: values[variable].value,
                }),
                {},
            ),
        )
            .then(() => setStatus(FetchStatus.Resolved))
            .catch(() => setStatus(FetchStatus.Rejected))
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
            <Button disabled={!valid || loading} onClick={onClick}>
                {!inactive && (
                    <Icons
                        icon={
                            loading ? 'transfer' : rejected ? 'delete' : 'check'
                        }
                    />
                )}
                Fetch{inactive ? null : loading ? 'ing' : 'ed'}
            </Button>
        </>
    )
}
