import { DocumentNode } from 'apollo-boost'

export interface Dictionary<T = any> {
    [key: string]: T
}

export type Required<T> = T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]> }
    : T

export enum FetchStatus {
    Inactive,
    Loading,
    Rejected,
    Resolved,
}

export enum VariableType {
    Unknown,
    Boolean,
    Number,
    String,
}

export type PackedDocumentNode = Omit<DocumentNode, 'definitions'> & {
    definitions: string[]
}

export interface Schema extends Object {
    type: string
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
