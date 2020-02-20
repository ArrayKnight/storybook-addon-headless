import { AxiosRequestConfig as AxiosClientConfig } from 'axios'
import { PresetConfig as ApolloClientConfig } from 'apollo-boost'
import { ThemeKeys } from 'react-json-view'

import { OneOrMore } from './generic'

export type RestfulOptions = AxiosClientConfig
export type RestfulOptionsTypes = OneOrMore<RestfulOptions>

export type GraphQLOptions = ApolloClientConfig
export type GraphQLOptionsTypes = OneOrMore<GraphQLOptions>

export interface HeadlessOptions {
    restful?: RestfulOptionsTypes
    graphql?: GraphQLOptionsTypes
    jsonDark?: ThemeKeys
    jsonLight?: ThemeKeys
}
