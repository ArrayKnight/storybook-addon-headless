import { Form, Icons } from '@storybook/components'
import Ajv from 'ajv'
import React, { memo, useEffect, useState } from 'react'

import {
    ApiParameters,
    Dictionary,
    FetchStatus,
    VariableState,
} from '../../types'
import { getVariableType, isNull } from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form
const ajv = new Ajv()

interface Props {
    hasData: boolean
    hasError: boolean
    parameters: ApiParameters
    onFetch: (variables: Dictionary) => Promise<any>
}

export const Variables = memo(
    ({ hasData, hasError, parameters, onFetch }: Props) => {
        const {
            autoFetchOnInit = false,
            defaults = {},
            variables = {},
        } = parameters
        const [states, setStates] = useState<Dictionary<VariableState>>(
            Object.entries(variables).reduce(
                (obj: Dictionary<VariableState>, [name, schema]) => {
                    const validator = ajv.compile(schema)
                    const value = defaults[name] ?? ''

                    validator(value)

                    const [error] = validator.errors || []

                    return {
                        ...obj,
                        [name]: {
                            type: getVariableType(schema),
                            validator,
                            dirty: false,
                            error: error?.message || null,
                            value,
                        },
                    }
                },
                {},
            ),
        )
        const [isValid, setIsValid] = useState(areValid(states))
        const [status, setStatus] = useState(FetchStatus.Inactive)
        const isInactive = status === FetchStatus.Inactive
        const isLoading = status === FetchStatus.Loading
        const isRejected = status === FetchStatus.Rejected
        const isResolved = status === FetchStatus.Resolved

        function areValid(obj: Dictionary<VariableState>): boolean {
            return Object.values(obj).every(({ error }) => isNull(error))
        }

        function onChange(name: string): (value: any) => void {
            return (value) => {
                const { [name]: state } = states
                const { validator } = state

                validator(value)

                const [error] = validator.errors || []
                const updated = {
                    ...states,
                    [name]: {
                        ...state,
                        dirty: true,
                        error: error?.message || null,
                        value,
                    },
                }

                setStatus(FetchStatus.Inactive)

                setStates(updated)

                setIsValid(areValid(updated))
            }
        }

        function fetch(): void {
            setStatus(FetchStatus.Loading)

            onFetch(
                Object.entries(states).reduce(
                    (obj, [name, { value }]) => ({
                        ...obj,
                        [name]: value,
                    }),
                    {},
                ),
            ).then(
                () => setStatus(FetchStatus.Resolved),
                () => setStatus(FetchStatus.Rejected),
            )
        }

        // TODO reset from resolved to inactive after timeout, clear timeout on unmount

        useEffect(() => {
            if (autoFetchOnInit && isValid && !hasData && !hasError) {
                fetch()
            }

            if (hasData) {
                setStatus(FetchStatus.Resolved)
            }

            if (hasError) {
                setStatus(FetchStatus.Rejected)
            }
        }, [])

        return (
            <>
                <Fieldset>
                    {Object.entries(states).map(
                        ([name, { type, dirty, error, value }]) => (
                            <Variable
                                key={name}
                                name={name}
                                type={type}
                                value={value}
                                error={dirty ? error : null}
                                onChange={onChange(name)}
                            />
                        ),
                    )}
                </Fieldset>
                <Button
                    disabled={!isValid || isLoading || isResolved}
                    onClick={fetch}
                >
                    {!isInactive && (
                        <Icons
                            icon={
                                isLoading
                                    ? 'transfer'
                                    : isRejected
                                    ? 'delete'
                                    : 'check'
                            }
                        />
                    )}
                    Fetch{isInactive ? null : isLoading ? 'ing' : 'ed'}
                </Button>
            </>
        )
    },
)
