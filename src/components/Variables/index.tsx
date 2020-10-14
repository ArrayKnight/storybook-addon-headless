import { Form, Icons } from '@storybook/components'
import React, { memo, useEffect, useState } from 'react'

import {
    ApiParameters,
    FetchStatus,
    SelectSchema,
    VariableState,
    VariableType,
} from '../../types'
import {
    ajv,
    getVariableType,
    hasOwnProperty,
    isItem,
    isNull,
    noopTransform,
} from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

export interface Props {
    hasData: boolean
    hasError: boolean
    parameters: ApiParameters
    onFetch: (variables: Record<string, unknown>) => Promise<unknown>
}

export function areValid(obj: Record<string, VariableState>): boolean {
    return Object.values(obj).every(({ error }) => isNull(error))
}

export function createState(
    defaults: ApiParameters['defaults'],
    variables: ApiParameters['variables'],
): Record<string, VariableState> {
    return Object.entries(variables).reduce(
        (obj: Record<string, VariableState>, [name, schema]) => {
            const type = getVariableType(schema)
            const validator = ajv.compile(
                type === VariableType.Select
                    ? {
                          ...schema,
                          enum: (schema as SelectSchema).enum.map(
                              (option: unknown) =>
                                  isItem(option) ? option.value : option,
                          ),
                      }
                    : schema,
            )
            const value =
                defaults[name] ??
                (type === VariableType.Boolean ? false : undefined)
            const isValid = validator(value)
            const dirty = hasOwnProperty(defaults, name) && !isValid
            const [error] = validator.errors || []
            const message = error?.message || null

            return {
                ...obj,
                [name]: {
                    schema,
                    type,
                    validator,
                    dirty,
                    error: message,
                    value,
                },
            }
        },
        {},
    )
}

export const Variables = memo(
    ({ hasData, hasError, parameters, onFetch }: Props) => {
        const {
            autoFetchOnInit = false,
            defaults = {},
            variables = {},
            transforms = {},
        } = parameters
        const [states, setStates] = useState(createState(defaults, variables))
        const [status, setStatus] = useState(FetchStatus.Inactive)
        const [isValid, setIsValid] = useState(areValid(states))
        const isInactive = status === FetchStatus.Inactive
        const isLoading = status === FetchStatus.Loading
        const isRejected = status === FetchStatus.Rejected

        async function change(name: string, value: unknown): Promise<void> {
            const { [name]: state } = states
            const { validator } = state

            await validator(value)

            const [error] = validator.errors || []
            const message = error?.message || null
            const updated = {
                ...states,
                [name]: {
                    ...state,
                    dirty: true,
                    error: message,
                    value,
                },
            }

            setStatus(FetchStatus.Inactive)

            setStates(updated)

            setIsValid(areValid(updated))
        }

        async function fetch(): Promise<void> {
            setStatus(FetchStatus.Loading)

            try {
                await onFetch(
                    Object.entries(states).reduce(
                        (acc, [name, { value }]) => ({
                            ...acc,
                            [name]: (transforms[name] || noopTransform)(value),
                        }),
                        {},
                    ),
                )

                setStatus(FetchStatus.Resolved)
            } catch {
                setStatus(FetchStatus.Rejected)
            }
        }

        useEffect(() => {
            if (autoFetchOnInit && isValid && !hasData && !hasError) {
                void fetch()
            }

            if (hasData) {
                setStatus(FetchStatus.Resolved)
            }

            if (hasError) {
                setStatus(FetchStatus.Rejected)
            }
        }, []) // eslint-disable-line react-hooks/exhaustive-deps

        return (
            <>
                <Fieldset>
                    {Object.entries(states).map(
                        ([name, { schema, type, dirty, error, value }]) => (
                            <Variable
                                key={name}
                                name={name}
                                schema={schema}
                                type={type}
                                value={value}
                                error={dirty ? error : null}
                                onChange={change}
                            />
                        ),
                    )}
                </Fieldset>
                <Form.Button disabled={!isValid || isLoading} onClick={fetch}>
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
                </Form.Button>
            </>
        )
    },
)

Variables.displayName = 'Variables'
