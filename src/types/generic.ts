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
    Date,
    Number,
    String,
}

export type PackedDocumentNode = Omit<DocumentNode, 'definitions'> & {
    definitions: string[]
}

export interface Schema extends Object {
    type: string
    [key: string]: any
}

export interface BooleanSchema extends Schema {
    type: 'boolean'
}

export interface DateTimeSchema extends Schema {
    type: 'string'
    format: 'date' | 'date-time' | 'time'
}

export interface NumberSchema extends Schema {
    type: 'number' | 'integer'
}

export interface StringSchema extends Schema {
    type: 'string'
}

export type KnownSchema =
    | BooleanSchema
    | DateTimeSchema
    | NumberSchema
    | StringSchema
