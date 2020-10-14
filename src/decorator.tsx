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

export function createFilteredRecord<T extends unknown>(
    keys: string[],
    values: Record<string, T>,
    defaultValue: T,
): Record<string, T> {
    return keys.reduce(
        (acc, key) => ({ ...acc, [key]: values[key] ?? defaultValue }),
        {},
    )
}

export const Decorator = memo(
    ({ channel, context, parameters, storyFn }: Props): ReactElement => {
        const keys = Object.keys(parameters)
        const [state, setState] = useState<UpdateMessage>({
            status: createFilteredRecord(keys, {}, FetchStatus.Inactive),
            data: createFilteredRecord(keys, {}, null),
            errors: createFilteredRecord(keys, {}, null),
        })
        const [connected, setConnected] = useState(false)
        const ctx: HeadlessStoryContext = {
            ...context,
            status: createFilteredRecord(
                keys,
                state.status,
                FetchStatus.Inactive,
            ),
            data: createFilteredRecord(keys, state.data, null),
            errors: createFilteredRecord(keys, state.errors, null),
        }

        function update(message: UpdateMessage): void {
            setState(message)
            setConnected(true)
        }

        useEffect(() => {
            channel.on(EVENT_DATA_UPDATED, update)

            return () => channel.off(EVENT_DATA_UPDATED, update)
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
