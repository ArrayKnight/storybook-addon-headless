import { useChannel, useParameter, useStorybookApi } from '@storybook/api'
import { TabsState } from '@storybook/components'
import { Theme, ThemeProvider, useTheme } from '@storybook/theming'
import React, { memo, useState } from 'react'
import Json, { InteractionProps } from 'react-json-view'

import { EVENT_DATA_UPDATED, EVENT_INITIALIZED, PARAM_KEY } from '../../config'
import {
    ApiParameters,
    Dictionary,
    HeadlessOptions,
    HeadlessParameters,
    HeadlessState,
} from '../../types'
import {
    createGraphQLPromise,
    createRestfulPromise,
    errorToJSON,
    getGraphQLUri,
    getRestfulUrl,
    isGraphQLParameters,
    isQuery,
    isRestfulParameters,
    isString,
} from '../../utilities'
import { Message } from '../Message'
import { Variables } from '../Variables'
import { Content, Root, Separator, TabContent } from './styled'

const initialState: HeadlessState = {
    storyId: '',
    options: {
        graphql: {},
        restful: {},
        jsonDark: 'colors',
        jsonLight: 'rjv-default',
    },
    data: {},
    errors: {},
}

interface Props {
    active: boolean
}

export const Panel = memo(({ active }: Props) => {
    const api = useStorybookApi()
    const theme = useTheme<Theme>()
    const parameters = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const [state, setState] = useState<HeadlessState>(initialState)

    const { storyId, data, errors, options } = state
    const { graphql, restful, jsonDark, jsonLight } = options
    const isReady = storyId === api.getCurrentStoryData()?.id

    const emit = useChannel({
        [EVENT_INITIALIZED]: (opts: HeadlessOptions, id: string) => {
            setState({
                ...state,
                storyId: id,
                options: {
                    ...options,
                    ...opts,
                },
            })

            emit(EVENT_DATA_UPDATED, {
                ...data,
            })
        },
    })

    function resetData(name: string): void {
        setState({
            ...state,
            data: {
                ...data,
                [name]: null,
            },
            errors: {
                ...errors,
                [name]: null,
            },
        })

        emit(EVENT_DATA_UPDATED, {
            ...data,
            [name]: null,
        })
    }

    function setData(name: string): (data: HeadlessState['data']) => void {
        return (updated) => {
            setState({
                ...state,
                data: {
                    ...data,
                    [name]: updated,
                },
                errors: {
                    ...errors,
                    [name]: null,
                },
            })

            emit(EVENT_DATA_UPDATED, {
                ...data,
                [name]: updated,
            })
        }
    }

    function setError(name: string): (error: Error) => void {
        return (error) => {
            setState({
                ...state,
                data: {
                    ...data,
                    [name]: null,
                },
                errors: {
                    ...errors,
                    [name]: errorToJSON(error),
                },
            })
        }
    }

    function fetch(
        name: string,
        params: ApiParameters,
    ): (variables: Dictionary) => Promise<any> {
        const setDataTo = setData(name)
        const setErrorTo = setError(name)

        return (variables) => {
            if (isGraphQLParameters(params) || isRestfulParameters(params)) {
                resetData(name)
            }

            return new Promise((resolve, reject) => {
                const promise = isGraphQLParameters(params)
                    ? createGraphQLPromise(graphql, params, variables)
                    : isRestfulParameters(params)
                    ? createRestfulPromise(restful, params, variables)
                    : Promise.reject(
                          new Error('Invalid config, skipping fetch'),
                      )

                promise.then(
                    (response) => {
                        setDataTo(response)

                        resolve(response)
                    },
                    (error) => {
                        setErrorTo(error)

                        reject(error)
                    },
                )
            })
        }
    }

    function updateData(name: string): (props: InteractionProps) => void {
        const setDataTo = setData(name)

        return ({ updated_src }) => setDataTo(updated_src)
    }

    if (isReady) {
        return (
            <ThemeProvider theme={{ active }}>
                <Root>
                    <Content>
                        <TabsState>
                            {Object.entries(parameters).map(
                                ([name, parameter]) => {
                                    const params: ApiParameters =
                                        isString(parameter) ||
                                        isQuery(parameter)
                                            ? ({
                                                  query: parameter,
                                              } as ApiParameters)
                                            : parameter
                                    const hasData = !!state.data[name]
                                    const hasError = !!state.errors[name]

                                    return (
                                        <div key={name} id={name} title={name}>
                                            <TabContent>
                                                <Message>
                                                    {isGraphQLParameters(params)
                                                        ? getGraphQLUri(
                                                              graphql,
                                                              params,
                                                          )
                                                        : getRestfulUrl(
                                                              restful,
                                                              params,
                                                              {},
                                                              true,
                                                          )}
                                                </Message>
                                                <Variables
                                                    hasData={hasData}
                                                    hasError={hasError}
                                                    parameters={params}
                                                    onFetch={fetch(
                                                        name,
                                                        params,
                                                    )}
                                                />
                                                {(hasData || hasError) && (
                                                    <>
                                                        <Separator />
                                                        <Json
                                                            src={
                                                                state.data[
                                                                    name
                                                                ] ||
                                                                state.errors[
                                                                    name
                                                                ]
                                                            }
                                                            name={null}
                                                            iconStyle="square"
                                                            theme={
                                                                theme.base ===
                                                                'light'
                                                                    ? jsonLight
                                                                    : jsonDark
                                                            }
                                                            collapsed={
                                                                hasError
                                                                    ? 1
                                                                    : false
                                                            }
                                                            displayObjectSize={
                                                                false
                                                            }
                                                            displayDataTypes={
                                                                false
                                                            }
                                                            enableClipboard={
                                                                hasData
                                                            }
                                                            onAdd={updateData(
                                                                name,
                                                            )}
                                                            onDelete={updateData(
                                                                name,
                                                            )}
                                                            onEdit={updateData(
                                                                name,
                                                            )}
                                                        />
                                                    </>
                                                )}
                                            </TabContent>
                                        </div>
                                    )
                                },
                            )}
                        </TabsState>
                    </Content>
                </Root>
            </ThemeProvider>
        )
    }

    return null
})
