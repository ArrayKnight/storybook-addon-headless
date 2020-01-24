import { AxiosRequestConfig as AxiosClientConfig } from 'axios'
import { PresetConfig as ApolloClientConfig } from 'apollo-boost'
import { ThemeKeys } from 'react-json-view'

export type RestfulOptions = AxiosClientConfig

export type GraphQLOptions = ApolloClientConfig

export interface HeadlessOptions {
    restful?: RestfulOptions
    graphql?: GraphQLOptions
    jsonDark?: ThemeKeys
    jsonLight?: ThemeKeys
}
