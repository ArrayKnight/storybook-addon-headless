import { DocumentNode } from '@apollo/client'

import { Dictionary, Transform } from './generic'
import { GraphQLOptions, RestfulOptions } from './options'
import { KnownSchema } from './schemas'

export type PackedDocumentNode = Omit<DocumentNode, 'definitions'> & {
    definitions: string[]
}

export type HeadlessParameter = string | PackedDocumentNode | ApiParameters

export interface HeadlessParameters {
    [name: string]: HeadlessParameter
}

export interface VariableParameters {
    [name: string]: KnownSchema
}

export interface BaseParameters {
    base?: string
    variables?: VariableParameters
    defaults?: Dictionary
    transforms?: Dictionary<Transform>
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
