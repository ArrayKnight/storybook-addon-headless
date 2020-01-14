import { DocumentNode, PresetConfig } from 'apollo-boost'
import { AxiosRequestConfig } from 'axios'
import { Schema } from 'yup'

interface Dictionary<T = any> {
    [key: string]: T
}

type UnsupportedAxiosOptions =
    | 'url'
    | 'method'
    | 'transformRequest'
    | 'transformResponse'
    | 'adapter'

export interface HeadlessOptions {
    restful?: Omit<AxiosRequestConfig, UnsupportedAxiosOptions>
    graphql?: PresetConfig
}

export interface HeadlessState {
    isReady: boolean
    options: HeadlessOptions
    data: Dictionary
}

export interface VariableParameters {
    [name: string]: Schema<any>
}

export interface GraphQLParameters {
    config?: PresetConfig
    query: DocumentNode
    variables: VariableParameters
}

export interface RestfulParameters {
    config?: AxiosRequestConfig
    query: string
    variables: VariableParameters
}

export interface HeadlessParameters {
    [name: string]:
        | string
        | DocumentNode
        | GraphQLParameters
        | RestfulParameters
}
