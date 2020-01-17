import {
    addons,
    DecoratorFunction,
    makeDecorator,
    OptionsParameter,
    StoryContext,
} from '@storybook/addons'
import { Channel } from '@storybook/channels'
import React, { ReactElement, useState } from 'react'

import { DECORATOR_NAME, EVENT_DATA, EVENT_INIT, PARAM_KEY } from './config'
import { HeadlessOptions, HeadlessParameters, HeadlessState } from './types'

interface Props {
    channel: Channel
    context: StoryContext
    options: HeadlessOptions & OptionsParameter
    parameters: HeadlessParameters
    storyFn: (context: StoryContext) => any
}

export const Decorator = ({
    channel,
    context,
    options,
    parameters,
    storyFn,
}: Props) => {
    const [state, setState] = useState(
        Object.keys(parameters).reduce(
            (obj, key) => ({ ...obj, [key]: null }),
            {},
        ),
    )

    channel.on(EVENT_DATA, (data: HeadlessState['data']) => {
        setState({
            ...state,
            ...data,
        })
    })

    return (
        <>
            {storyFn({
                ...context,
                data: state,
            })}
        </>
    )
}

export const headlessDecorator: (
    options: HeadlessOptions,
) => DecoratorFunction<ReactElement<unknown>> = makeDecorator({
    name: DECORATOR_NAME,
    parameterName: PARAM_KEY,
    skipIfNoParametersOrOptions: true,
    wrapper: (storyFn, context, { options, parameters }) => {
        const channel = addons.getChannel()

        channel.emit(EVENT_INIT, options)

        return (
            <Decorator
                channel={channel}
                context={context}
                options={options}
                parameters={parameters}
                storyFn={storyFn}
            />
        )
    },
})
