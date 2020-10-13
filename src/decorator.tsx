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
import React, {
    memo,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react'

import {
    DECORATOR_NAME,
    EVENT_DATA_UPDATED,
    EVENT_INITIALIZED,
    PARAM_KEY,
} from './config'
import {
    FetchStatus,
    HeadlessOptions,
    HeadlessParameters,
    HeadlessStoryContext,
    InitializeMessage,
    UpdateMessage,
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
        const keys = Object.keys(parameters)
        const [message, setMessage] = useState<UpdateMessage>({
            status: keys.reduce(
                (obj, key) => ({ ...obj, [key]: FetchStatus.Inactive }),
                {},
            ),
            data: keys.reduce((obj, key) => ({ ...obj, [key]: null }), {}),
            errors: keys.reduce((obj, key) => ({ ...obj, [key]: null }), {}),
        })
        const [connected, setConnected] = useState(false)
        const receiveMessage = useCallback((update: UpdateMessage) => {
            setMessage(update)
            setConnected(true)
        }, [])
        const ctx: HeadlessStoryContext = {
            ...context,
            ...message,
        }

        useEffect(() => {
            channel.on(EVENT_DATA_UPDATED, receiveMessage)

            return () => channel.off(EVENT_DATA_UPDATED, receiveMessage)
        })

        return connected ? storyFn(ctx) : null
    },
)

Decorator.displayName = 'Decorator'

export function wrapper(
    storyFn: StoryGetter,
    context: StoryContext,
    { options, parameters }: WrapperSettings,
): ReactElement {
    const channel = addons.getChannel()
    const message: InitializeMessage = {
        storyId: context.id,
        options: options as HeadlessOptions & OptionsParameter,
    }

    channel.emit(EVENT_INITIALIZED, message)

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
