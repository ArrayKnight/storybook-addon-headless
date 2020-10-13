import type { ApolloClientOptions } from '@apollo/client'
import type { AxiosRequestConfig as AxiosClientConfig } from 'axios'
import type { ThemeKeys } from 'react-json-view'

import { OneOrMore } from './generic'

export type RestfulOptions = AxiosClientConfig
export type RestfulOptionsTypes = OneOrMore<RestfulOptions>

export type GraphQLOptions = Omit<
    ApolloClientOptions<unknown>,
    'cache' | 'link'
>
export type GraphQLOptionsTypes = OneOrMore<GraphQLOptions>

export interface HeadlessOptions {
    restful?: RestfulOptionsTypes
    graphql?: GraphQLOptionsTypes
    jsonDark?: ThemeKeys
    jsonLight?: ThemeKeys
}
