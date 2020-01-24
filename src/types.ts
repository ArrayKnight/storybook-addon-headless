import { ValidateFunction } from 'ajv'
import { DocumentNode, PresetConfig as ApolloClientConfig } from 'apollo-boost'
import { AxiosRequestConfig as AxiosClientConfig } from 'axios'
import { ThemeKeys } from 'react-json-view'

export interface Dictionary<T = any> {
    [key: string]: T
}

export type Required<T> = T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]> }
    : T

export type RestfulOptions = AxiosClientConfig

export type GraphQLOptions = ApolloClientConfig

export interface HeadlessOptions {
    restful?: RestfulOptions
    graphql?: GraphQLOptions
    jsonDark?: ThemeKeys
    jsonLight?: ThemeKeys
}

export type HeadlessParameter = string | PackedDocumentNode | ApiParameters

export interface HeadlessParameters {
    [name: string]: HeadlessParameter
}

export interface HeadlessState {
    storyId: string
    options: Required<HeadlessOptions>
    data: Dictionary
    errors: Dictionary
}

export interface VariableParameters {
    [name: string]: Schema
}

export interface VariableState {
    type: VariableType
    validator: ValidateFunction
    dirty: boolean
    error: string | null
    value: any
}

export enum VariableType {
    Unknown,
    Boolean,
    Number,
    String,
}

export interface BaseParameters {
    variables?: VariableParameters
    defaults?: Dictionary
    autoFetchOnInit?: boolean
}

export interface GraphQLParameters extends BaseParameters {
    query: PackedDocumentNode
    config?: GraphQLOptions
}

export interface RestfulParameters extends BaseParameters {
    query: string
    config?: RestfulOptions
    convertToFormData?: boolean
}

export type ApiParameters = GraphQLParameters | RestfulParameters

export type PackedDocumentNode = Omit<DocumentNode, 'definitions'> & {
    definitions: string[]
}

export interface Schema extends Object {
    type: string
    // TODO
}

export interface BooleanSchema {
    type: 'boolean'
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
