import { DocumentNode, PresetConfig } from 'apollo-boost'
import { AxiosRequestConfig } from 'axios'

export interface Dictionary<T = any> {
    [key: string]: T
}

type UnsupportedAxiosOptions =
    | 'url'
    | 'method'
    | 'transformRequest'
    | 'transformResponse'
    | 'adapter'

export type RestfulOptions = Omit<AxiosRequestConfig, UnsupportedAxiosOptions>

export type GraphQLOptions = PresetConfig

export interface HeadlessOptions {
    restful?: RestfulOptions
    graphql?: GraphQLOptions
}

export type HeadlessParameter = string | DocumentNode | ApiParameters

export interface HeadlessParameters {
    [name: string]: HeadlessParameter
}

export interface HeadlessState {
    isReady: boolean
    options: HeadlessOptions
    data: Dictionary
}

export interface VariableParameters {
    [name: string]: object
}

export interface VariableState {
    value: any
    isValid: boolean
}

export interface GraphQLParameters {
    config?: PresetConfig
    query: DocumentNode
    variables: VariableParameters
    defaults?: Dictionary
}

export interface RestfulParameters {
    config?: AxiosRequestConfig
    query: string
    variables: VariableParameters
    defaults?: Dictionary
    convertToFormData?: boolean
}

export type ApiParameters = GraphQLParameters | RestfulParameters

export interface Document {
    kind: 'Document'
    // TODO
}

export interface Schema {
    type: string
    // TODO
}

export interface NumberSchema {
    type: 'number' | 'integer'
}

export interface StringSchema {
    type: 'string'
}

export enum FetchStatus {
    Inactive,
    Loading,
    Rejected,
    Resolved,
}
