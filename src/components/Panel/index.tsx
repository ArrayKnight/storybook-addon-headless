import { useAddonState, useChannel, useParameter } from '@storybook/api'
import { TabsState } from '@storybook/components'
import React from 'react'
import Json from 'react-json-view'

import { ADDON_ID, EVENT_DATA, EVENT_OPTS, PARAM_KEY } from '../../config'
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
    isGraphQLParameters,
    isQuery,
    isRestfulParameters,
    isString,
} from '../../utilities'
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
    const parameter = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const parameters = Object.entries(parameter)
    const emit = useChannel({
        [EVENT_OPTS]: (options: HeadlessOptions) => {
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

                return createGraphQLPromise(
                    state.options.graphql || {},
                    params,
                    variables,
                ) // TODO .then
            }

            if (isRestfulParameters(params)) {
                resetData(name)

                return createRestfulPromise(
                    state.options.restful || {},
                    params,
                    variables,
                )
                    .then(setDataTo)
                    .catch(setErrorTo)
            }

            return Promise.reject('Invalid config, skipping fetch')
        }
    }

    // TODO create forms
    // TODO create inputs/outputs
    // TODO create instances, call queries on submit
    // TODO handle query state
    // TODO pass data through channel to decorator
    // TODO create data editor + pass edited data through channel to decorator

    if (active && state.isReady && parameters.length > 0) {
        return (
            <Root>
                <Content>
                    <TabsState>
                        {parameters.map(([name, config]) => {
                            const params: ApiParameters =
                                isString(config) || isQuery(config)
                                    ? ({
                                          query: config,
                                          variables: {},
                                      } as ApiParameters)
                                    : config

                            return (
                                <div key={name} id={name} title={name}>
                                    <TabContent>
                                        <Variables
                                            parameters={params}
                                            onFetch={onFetch(name, params)}
                                        />
                                        {(!!state.data[name] ||
                                            !!state.errors[name]) && (
                                            <>
                                                <Separator />
                                                <Json
                                                    src={
                                                        state.data[name] ||
                                                        state.errors[name]
                                                    }
                                                    name={null}
                                                    iconStyle="square"
                                                    displayObjectSize={false}
                                                    displayDataTypes={false}
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
