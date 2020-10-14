import { useChannel, useParameter, useStorybookApi } from '@storybook/api'
import { TabsState } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import React, { memo } from 'react'
import type { InteractionProps } from 'react-json-view'
import { useStorageState } from 'react-storage-hooks'

import {
    EVENT_DATA_UPDATED,
    EVENT_INITIALIZED,
    PARAM_KEY,
    STORAGE_KEY,
} from '../../config'
import {
    ApiParameters,
    FetchStatus,
    HeadlessParameters,
    HeadlessState,
    InitializeMessage,
    UpdateMessage,
} from '../../types'
import {
    fetchViaGraphQL,
    fetchViaRestful,
    errorToJSON,
    isGraphQLParameters,
    isRestfulParameters,
    isFunction,
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
    status: {},
    data: {},
    errors: {},
}

interface Props {
    active?: boolean
}

export const Panel = memo(({ active }: Props) => {
    const api = useStorybookApi()
    const headlessParameters = useParameter<HeadlessParameters>(PARAM_KEY, {})
    const [state, setStorageState] = useStorageState<HeadlessState>(
        sessionStorage,
        STORAGE_KEY,
        initialState,
    )
    const emit = useChannel({
        [EVENT_INITIALIZED]: ({ storyId, options }: InitializeMessage) => {
            setState((prev) => ({
                storyId,
                options: {
                    ...prev.options,
                    ...options,
                },
            }))
        },
    })

    function setState(
        update:
            | Partial<HeadlessState>
            | ((prev: HeadlessState) => Partial<HeadlessState>),
    ): void {
        setStorageState((prev) => {
            const next: HeadlessState = {
                ...prev,
                ...(isFunction(update) ? update(prev) : update),
            }
            const { status, data, errors } = next

            notify({
                status,
                data,
                errors,
            })

            return next
        })
    }

    function notify(message: UpdateMessage): void {
        emit(EVENT_DATA_UPDATED, message)
    }

    function update(
        name: string,
        status: FetchStatus,
        data: unknown,
        error: Record<string, unknown> | null,
    ): void {
        setState((prev) => ({
            status: {
                ...prev.status,
                [name]: status,
            },
            data: {
                ...prev.data,
                [name]: data,
            },
            errors: {
                ...prev.errors,
                [name]: error,
            },
        }))
    }

    async function fetch(
        name: string,
        apiParameters: ApiParameters,
        variables: Record<string, unknown>,
    ): Promise<unknown> {
        if (
            isGraphQLParameters(apiParameters) ||
            isRestfulParameters(apiParameters)
        ) {
            update(name, FetchStatus.Loading, null, null)
        }

        try {
            const response = await (isGraphQLParameters(apiParameters)
                ? fetchViaGraphQL(
                      state.options.graphql,
                      apiParameters,
                      variables,
                  )
                : isRestfulParameters(apiParameters)
                ? fetchViaRestful(
                      state.options.restful,
                      apiParameters,
                      variables,
                  )
                : Promise.reject(new Error('Invalid config, skipping fetch')))

            update(name, FetchStatus.Resolved, response, null)

            return response
        } catch (error) {
            update(name, FetchStatus.Resolved, null, errorToJSON(error))

            return error
        }
    }

    function updateData(name: string, { updated_src }: InteractionProps): void {
        update(name, FetchStatus.Resolved, updated_src, null)
    }

    if (state.storyId === api.getCurrentStoryData()?.id) {
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
                                            data={state.data[name]}
                                            error={state.errors[name]}
                                            options={state.options}
                                            parameter={parameter}
                                            onFetch={fetch}
                                            onUpdate={updateData}
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
