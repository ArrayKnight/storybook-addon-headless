import { addons, DecoratorFunction, makeDecorator } from '@storybook/addons'
import ApolloClient, { PresetConfig } from 'apollo-boost'
import axios, { AxiosRequestConfig } from 'axios'

import { DECORATOR_NAME, PARAM_KEY } from './config'

type UnsupportedAxiosParameters =
    | 'url'
    | 'method'
    | 'transformRequest'
    | 'transformResponse'
    | 'adapter'

export interface HeadlessOptions {
    restApi?: Omit<AxiosRequestConfig, UnsupportedAxiosParameters>
    graphQL?: PresetConfig
}

export const headlessDecorator: (
    options: HeadlessOptions,
) => DecoratorFunction = makeDecorator({
    name: DECORATOR_NAME,
    parameterName: PARAM_KEY,
    skipIfNoParametersOrOptions: true,
    wrapper: (storyFn, context, { options, parameters }) => {
        const channel = addons.getChannel()

        if (options.restApi) {
            channel.emit('restApi', axios(options.restApi))
        }

        if (options.graphQL) {
            channel.emit('graphQL', new ApolloClient(options.graphQL))
        }

        return storyFn(context)
    },
})
