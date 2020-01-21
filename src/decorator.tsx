import {
    addons,
    DecoratorFunction,
    makeDecorator,
    OptionsParameter,
    StoryContext,
} from '@storybook/addons'
import { Channel } from '@storybook/channels'
import { STORY_CHANGED } from '@storybook/core-events'
import React, { memo, ReactElement, useEffect, useState } from 'react'

import {
    DECORATOR_NAME,
    EVENT_DATA_UPDATED,
    EVENT_INITIALIZED,
    EVENT_STORY_CHANGED,
    PARAM_KEY,
} from './config'
import { HeadlessOptions, HeadlessParameters, HeadlessState } from './types'

interface Props {
    channel: Channel
    context: StoryContext
    options: HeadlessOptions & OptionsParameter
    parameters: HeadlessParameters
    storyFn: (context: StoryContext) => any
}

export const Decorator = memo(
    ({ channel, context, options, parameters, storyFn }: Props) => {
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

export const headlessDecorator: (
    options: HeadlessOptions,
) => DecoratorFunction<ReactElement<unknown>> = makeDecorator({
    name: DECORATOR_NAME,
    parameterName: PARAM_KEY,
    skipIfNoParametersOrOptions: true,
    wrapper: (storyFn, context, { options, parameters }) => {
        const channel = addons.getChannel()

        channel.emit(EVENT_INITIALIZED, options, context.id)

        console.log('wrapper', context.id)

        channel.once(STORY_CHANGED, (storyId) => {
            console.log(STORY_CHANGED, storyId)

            channel.emit(EVENT_STORY_CHANGED, storyId)
        })

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
