import {
    useAddonState,
    useChannel,
    useParameter,
    useStorybookApi,
} from '@storybook/api'
import { TabsState } from '@storybook/components'
import React, { memo } from 'react'

import { ADDON_ID, EVENT_INIT, PARAM_KEY } from '../../config'
import { HeadlessOptions, HeadlessParameters, HeadlessState } from '../../types'
import { Root } from './styled'

export const Panel = memo(() => {
    const api = useStorybookApi()
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

    // TODO create instances
    // TODO create forms
    // TODO create inputs/outputs
    // TODO call queries on submit
    // TODO handle query state
    // TODO pass data through channel to decorator
    // TODO create data editor + pass edited data through channel to decorator

    console.log({ api, emit, state, parameters })

    if (state.isReady && parameters.length > 0) {
        return (
            <Root>
                <TabsState>
                    {parameters.map(([name, param]) => (
                        <div key={name} id={name} title={name}>
                            {name}
                        </div>
                    ))}
                </TabsState>
            </Root>
        )
    }

    return null
})
