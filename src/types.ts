import { DocumentNode, PresetConfig } from 'apollo-boost'
import { AxiosRequestConfig } from 'axios'
import { ThemeKeys } from 'react-json-view'

export interface Dictionary<T = any> {
    [key: string]: T
}

export type Required<T> = T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]> }
    : T

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
    jsonDark?: ThemeKeys
    jsonLight?: ThemeKeys
}

export type HeadlessParameter = string | DocumentNode | ApiParameters

export interface HeadlessParameters {
    [name: string]: HeadlessParameter
}

export interface HeadlessState {
    isReady: boolean
    options: Required<HeadlessOptions>
    data: Dictionary
    errors: Dictionary
}

export interface VariableParameters {
    [name: string]: object
}

export interface VariableState {
    value: any
    isValid: boolean
}

export interface GraphQLParameters {
    query: PackedDocumentNode
    config?: PresetConfig
    variables?: VariableParameters
    defaults?: Dictionary
}

export interface RestfulParameters {
    query: string
    config?: AxiosRequestConfig
    variables?: VariableParameters
    defaults?: Dictionary
    convertToFormData?: boolean
}

export type ApiParameters = GraphQLParameters | RestfulParameters

export type PackedDocumentNode = Omit<DocumentNode, 'definitions'> & {
    definitions: string[]
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
