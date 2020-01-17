import { Form, Icons } from '@storybook/components'
import React, { useState } from 'react'

import {
    ApiParameters,
    Dictionary,
    FetchStatus,
    VariableState,
} from '../../types'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form

interface Props {
    parameters: ApiParameters
    onFetch: (variables: Dictionary) => Promise<any>
}

export const Variables = ({ parameters, onFetch }: Props) => {
    const variables = Object.entries(parameters.variables)
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
    const { inactive, loading, rejected, resolved } = {
        inactive: status === FetchStatus.Inactive,
        loading: status === FetchStatus.Loading,
        rejected: status === FetchStatus.Rejected,
        resolved: status === FetchStatus.Resolved,
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
            <Button disabled={!valid || loading || resolved} onClick={onClick}>
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
