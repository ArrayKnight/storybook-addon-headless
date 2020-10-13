import type { DocumentNode } from '@apollo/client'

import type { Transform } from './generic'
import type { GraphQLOptions, RestfulOptions } from './options'
import type { KnownSchema } from './schemas'

export type PackedDocumentNode = Omit<DocumentNode, 'definitions' | 'loc'> & {
    definitions: string[]
    source?: string
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
    defaults?: Record<string, unknown>
    transforms?: Record<string, Transform>
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
