import {
    addons,
    DecoratorFunction,
    makeDecorator,
    OptionsParameter,
    StoryContext,
    StoryGetter,
    WrapperSettings,
} from '@storybook/addons'
import { Channel } from '@storybook/channels'
import React, { memo, ReactElement, useEffect, useState } from 'react'

import {
    DECORATOR_NAME,
    EVENT_DATA_UPDATED,
    EVENT_INITIALIZED,
    PARAM_KEY,
} from './config'
import type {
    HeadlessOptions,
    HeadlessParameters,
    HeadlessState,
} from './types'

interface Props {
    channel: Channel
    context: StoryContext
    options: HeadlessOptions & OptionsParameter
    parameters: HeadlessParameters
    storyFn: (context: StoryContext) => ReactElement
}

export const Decorator = memo(
    ({ channel, context, parameters, storyFn }: Props): ReactElement => {
        const [state, setState] = useState({
            data: Object.keys(parameters).reduce(
                (obj, key) => ({ ...obj, [key]: null }),
                {},
            ),
            received: false,
        })

        function setData(data: HeadlessState['data']): void {
            setState({
                data: {
                    ...state.data,
                    ...data,
                },
                received: true,
            })
        }

        useEffect(() => {
            channel.on(EVENT_DATA_UPDATED, setData)

            return () => channel.off(EVENT_DATA_UPDATED, setData)
        })

        return state.received
            ? storyFn({
                  ...context,
                  data: state.data,
              })
            : null
    },
)

Decorator.displayName = 'Decorator'

export function wrapper(
    storyFn: StoryGetter,
    context: StoryContext,
    { options, parameters }: WrapperSettings,
): ReactElement {
    const channel = addons.getChannel()

    channel.emit(EVENT_INITIALIZED, options, context.id)

    return (
        <Decorator
            channel={channel}
            context={context}
            options={options}
            parameters={parameters}
            storyFn={storyFn}
        />
    )
}

export const withHeadless: (
    options: HeadlessOptions,
) => DecoratorFunction<ReactElement<unknown>> = makeDecorator({
    name: DECORATOR_NAME,
    parameterName: PARAM_KEY,
    skipIfNoParametersOrOptions: true,
    wrapper,
})
