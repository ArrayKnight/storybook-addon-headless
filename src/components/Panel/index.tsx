import { useAddonState, useChannel, useParameter } from '@storybook/api'
import { TabsState } from '@storybook/components'
import React from 'react'

import { ADDON_ID, /*EVENT_DATA, */ EVENT_INIT, PARAM_KEY } from '../../config'
import {
    Dictionary,
    HeadlessOptions,
    HeadlessParameters,
    HeadlessState,
} from '../../types'
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
    /*const emit = */ useChannel({
        [EVENT_INIT]: (options: HeadlessOptions) => {
            setState({
                isReady: true,
                options,
                data: {},
            })
        },
    })

    /*function setData(data: HeadlessState['data']): void {
        setState({
            ...state,
            data: {
                ...state.data,
                ...data,
            },
        })

        emit(EVENT_DATA, {
            ...state.data,
            ...data,
        })
    }*/

    function onFetch(variables: Dictionary): Promise<any> {
        console.log(variables)

        // TODO
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    resolve()
                } else {
                    reject()
                }
            }, 1000 * 2 * Math.random())
        })
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
                        {parameters.map(([name, config]) => (
                            <div key={name} id={name} title={name}>
                                <TabContent>
                                    <Variables
                                        parameter={config}
                                        onFetch={onFetch}
                                    />
                                </TabContent>
                            </div>
                        ))}
                    </TabsState>
                </Content>
            </Root>
        )
    }

    return null
}
