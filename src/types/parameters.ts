import { Dictionary, KnownSchema, PackedDocumentNode } from './generic'
import { GraphQLOptions, RestfulOptions } from './options'

export type HeadlessParameter = string | PackedDocumentNode | ApiParameters

export interface HeadlessParameters {
    [name: string]: HeadlessParameter
}

export interface VariableParameters {
    [name: string]: KnownSchema
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
