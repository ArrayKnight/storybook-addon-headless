import { useAddonState, useChannel, useParameter } from '@storybook/api'
import { TabsState } from '@storybook/components'
import React from 'react'
import Json from 'react-json-view'

import { ADDON_ID, EVENT_DATA, EVENT_INIT, PARAM_KEY } from '../../config'
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

interface Props {
    active: boolean
}

export const Panel = ({ active }: Props) => {
    const [state, setState] = useAddonState<HeadlessState>(ADDON_ID, {
        isReady: false,
        options: {},
        data: {},
        errors: {},
    })
    const parameters = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const emit = useChannel({
        [EVENT_INIT]: (options: HeadlessOptions) => {
            setState({
                ...state,
                isReady: true,
                options,
            })

            emit(EVENT_DATA, {
                ...state.data,
            })
        },
    })
    const graphQLOptions = state.options.graphql || {}
    const restfulOptions = state.options.restful || {}

    function resetData(name: string): void {
        setState({
            ...state,
            data: {
                ...state.data,
                [name]: null,
            },
            errors: {
                ...state.errors,
                [name]: null,
            },
        })

        emit(EVENT_DATA, {
            ...state.data,
            [name]: null,
        })
    }

    function setData(name: string): (data: HeadlessState['data']) => void {
        return (data) => {
            setState({
                ...state,
                data: {
                    ...state.data,
                    [name]: data,
                },
                errors: {
                    ...state.errors,
                    [name]: null,
                },
            })

            emit(EVENT_DATA, {
                ...state.data,
                [name]: data,
            })
        }
    }

    function setError(name: string): (error: Error) => void {
        return (error) => {
            setState({
                ...state,
                data: {
                    ...state.data,
                    [name]: null,
                },
                errors: {
                    ...state.errors,
                    [name]: errorToJSON(error),
                },
            })
        }
    }

    function onFetch(
        name: string,
        params: ApiParameters,
    ): (variables: Dictionary) => Promise<any> {
        return (variables) => {
            const setDataTo = setData(name)
            const setErrorTo = setError(name)

            if (isGraphQLParameters(params)) {
                resetData(name)

                return new Promise((resolve, reject) => {
                    createGraphQLPromise(
                        graphQLOptions,
                        params,
                        variables,
                    ).then(
                        (data) => {
                            setDataTo(data)

                            resolve(data)
                        },
                        (error) => {
                            setErrorTo(error)

                            reject(error)
                        },
                    )
                })
            }

            if (isRestfulParameters(params)) {
                resetData(name)

                return new Promise((resolve, reject) => {
                    createRestfulPromise(
                        restfulOptions,
                        params,
                        variables,
                    ).then(
                        (data) => {
                            setDataTo(data)

                            resolve(data)
                        },
                        (error) => {
                            setErrorTo(error)

                            reject(error)
                        },
                    )
                })
            }

            return Promise.reject(
                new Error('Invalid config, skipping fetch'),
            ).catch(setErrorTo)
        }
    }

    // TODO create forms
    // TODO create inputs/outputs
    // TODO create instances, call queries on submit
    // TODO handle query state
    // TODO pass data through channel to decorator
    // TODO create data editor + pass edited data through channel to decorator

    if (active && state.isReady) {
        return (
            <Root>
                <Content>
                    <TabsState>
                        {Object.entries(parameters).map(([name, parameter]) => {
                            const params: ApiParameters =
                                isString(parameter) || isQuery(parameter)
                                    ? ({ query: parameter } as ApiParameters)
                                    : parameter
                            const hasData = !!state.data[name]
                            const hasError = !!state.errors[name]

                            return (
                                <div key={name} id={name} title={name}>
                                    <TabContent>
                                        <Message>
                                            {isGraphQLParameters(params)
                                                ? getGraphQLUri(
                                                      graphQLOptions,
                                                      params,
                                                  )
                                                : getRestfulUrl(
                                                      restfulOptions,
                                                      params,
                                                      {},
                                                      true,
                                                  )}
                                        </Message>
                                        <Variables
                                            parameters={params}
                                            onFetch={onFetch(name, params)}
                                        />
                                        {(hasData || hasError) && (
                                            <>
                                                <Separator />
                                                <Json
                                                    src={
                                                        state.data[name] ||
                                                        state.errors[name]
                                                    }
                                                    name={null}
                                                    iconStyle="square"
                                                    collapsed={
                                                        hasError ? 1 : false
                                                    }
                                                    displayObjectSize={false}
                                                    displayDataTypes={false}
                                                    enableClipboard={hasData}
                                                />
                                            </>
                                        )}
                                    </TabContent>
                                </div>
                            )
                        })}
                    </TabsState>
                </Content>
            </Root>
        )
    }

    return null
}
