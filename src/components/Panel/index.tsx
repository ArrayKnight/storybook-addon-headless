import { useAddonState, useChannel, useParameter } from '@storybook/api'
import { TabsState } from '@storybook/components'
import React from 'react'

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
    isGraphQLParameters,
    isQuery,
    isRestfulParameters,
    isString,
} from '../../utilities'
import { Variables } from '../Variables'
import { Content, Root, TabContent } from './styled'

interface Props {
    active: boolean
}

export const Panel = ({ active }: Props) => {
    const [state, setState] = useAddonState<HeadlessState>(ADDON_ID, {
        isReady: false,
        options: {},
        data: {},
    })
    const parameter = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const parameters = Object.entries(parameter)
    const emit = useChannel({
        [EVENT_INIT]: (options: HeadlessOptions) => {
            setState({
                isReady: true,
                options,
                data: {},
            })
        },
    })

    function setData(name: string): (data: HeadlessState['data']) => void {
        return (data) => {
            setState({
                ...state,
                data: {
                    ...state.data,
                    [name]: data,
                },
            })

            emit(EVENT_DATA, {
                ...state.data,
                [name]: data,
            })
        }
    }

    function onFetch(
        name: string,
        params: ApiParameters,
    ): (variables: Dictionary) => Promise<any> {
        return (variables) => {
            if (isGraphQLParameters(params)) {
                return createGraphQLPromise(
                    state.options.graphql || {},
                    params,
                    variables,
                ) // TODO .then
            }

            if (isRestfulParameters(params)) {
                return createRestfulPromise(
                    state.options.restful || {},
                    params,
                    variables,
                ).then(setData(name))
            }

            return Promise.reject()
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
