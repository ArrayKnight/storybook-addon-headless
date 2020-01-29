import { Form, Icons } from '@storybook/components'
import Ajv from 'ajv'
import defineKeywords from 'ajv-keywords'
import React, { memo, useEffect, useState } from 'react'

import {
    ApiParameters,
    Dictionary,
    FetchStatus,
    VariableState,
    VariableType,
} from '../../types'
import { getVariableType, isItem, isNull, noopTransform } from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form
const ajv = new Ajv()

defineKeywords(ajv)

export interface Props {
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
            transforms = {},
        } = parameters
        const [states, setStates] = useState<Dictionary<VariableState>>(
            Object.entries(variables).reduce(
                (obj: Dictionary<VariableState>, [name, schema]) => {
                    const type = getVariableType(schema)
                    const validator = ajv.compile(
                        type === VariableType.Select
                            ? {
                                  ...schema,
                                  enum: schema.enum.map((option: any) =>
                                      isItem(option) ? option.value : option,
                                  ),
                              }
                            : schema,
                    )
                    const value =
                        defaults[name] ??
                        (type === VariableType.Boolean ? false : undefined)
                    const isInitialValueValid = validator(value)
                    const dirty =
                        defaults.hasOwnProperty(name) && !isInitialValueValid
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
            ),
        )
        const [isValid, setIsValid] = useState(areValid(states))
        const [status, setStatus] = useState(FetchStatus.Inactive)
        const isInactive = status === FetchStatus.Inactive
        const isLoading = status === FetchStatus.Loading
        const isRejected = status === FetchStatus.Rejected

        function areValid(obj: Dictionary<VariableState>): boolean {
            return Object.values(obj).every(({ error }) => isNull(error))
        }

        function onChange(name: string): (value: any) => void {
            return (value) => {
                const { [name]: state } = states
                const { validator } = state

                validator(value)

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
        }

        function fetch(): void {
            setStatus(FetchStatus.Loading)

            onFetch(
                Object.entries(states).reduce(
                    (obj, [name, { value }]) => ({
                        ...obj,
                        [name]: (transforms[name] || noopTransform)(value),
                    }),
                    {},
                ),
            ).then(
                () => setStatus(FetchStatus.Resolved),
                () => setStatus(FetchStatus.Rejected),
            )
        }

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
                        ([name, { schema, type, dirty, error, value }]) => (
                            <Variable
                                key={name}
                                name={name}
                                schema={schema}
                                type={type}
                                value={value}
                                error={dirty ? error : null}
                                onChange={onChange(name)}
                            />
                        ),
                    )}
                </Fieldset>
                <Button disabled={!isValid || isLoading} onClick={fetch}>
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
