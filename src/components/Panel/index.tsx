import { useChannel, useParameter, useStorybookApi } from '@storybook/api'
import { TabsState } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import React, { memo, useCallback, useState } from 'react'
import type { InteractionProps } from 'react-json-view'

import { EVENT_DATA_UPDATED, EVENT_INITIALIZED, PARAM_KEY } from '../../config'
import type {
    ApiParameters,
    HeadlessOptions,
    HeadlessParameters,
    HeadlessState,
} from '../../types'
import {
    fetchViaGraphQL,
    fetchViaRestful,
    errorToJSON,
    isGraphQLParameters,
    isRestfulParameters,
} from '../../utilities'
import { Tab } from './Tab'
import { Content, Root } from './styled'

export const initialState: HeadlessState = {
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
    active?: boolean
}

export const Panel = memo(({ active }: Props) => {
    const api = useStorybookApi()
    const headlessParameters = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const [state, setState] = useState<HeadlessState>(initialState)
    const { storyId, data, errors, options } = state
    const { graphql, restful } = options
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
    const resetData = useCallback(
        (name: string) => {
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
        },
        [state],
    )
    const setData = useCallback(
        (name: string, updated: unknown) => {
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
        },
        [state],
    )
    const setError = useCallback(
        (name: string, error: Error) => {
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
        },
        [state],
    )
    const fetch = useCallback(
        async (
            name: string,
            apiParameters: ApiParameters,
            variables: Record<string, unknown>,
        ): Promise<unknown> => {
            if (
                isGraphQLParameters(apiParameters) ||
                isRestfulParameters(apiParameters)
            ) {
                resetData(name)
            }

            try {
                const response = await (isGraphQLParameters(apiParameters)
                    ? fetchViaGraphQL(graphql, apiParameters, variables)
                    : isRestfulParameters(apiParameters)
                    ? fetchViaRestful(restful, apiParameters, variables)
                    : Promise.reject(
                          new Error('Invalid config, skipping fetch'),
                      ))

                setData(name, response)

                return response
            } catch (error) {
                setError(name, error)

                return error
            }
        },
        [graphql, restful, resetData, setData, setError],
    )
    const update = useCallback(
        (name: string, { updated_src }: InteractionProps) => {
            setData(name, updated_src)
        },
        [setData],
    )

    if (storyId === api.getCurrentStoryData()?.id) {
        return (
            <ThemeProvider theme={{ active }}>
                <Root>
                    <Content>
                        <TabsState>
                            {Object.entries(headlessParameters).map(
                                ([name, parameter]) => (
                                    // Must exist here (not inside of Tab) with these attributes for TabsState to function
                                    <div id={name} key={name} title={name}>
                                        <Tab
                                            name={name}
                                            data={data[name]}
                                            error={errors[name]}
                                            options={options}
                                            parameter={parameter}
                                            onFetch={fetch}
                                            onUpdate={update}
                                        />
                                    </div>
                                ),
                            )}
                        </TabsState>
                    </Content>
                </Root>
            </ThemeProvider>
        )
    }

    return null
})

Panel.displayName = 'Panel'
