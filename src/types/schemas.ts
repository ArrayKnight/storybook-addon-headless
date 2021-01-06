import { AsyncSchema, SchemaObject } from 'ajv'

export type AnySchema = AsyncSchema | SchemaObject

export type BooleanSchema = AnySchema & {
    type: 'boolean'
}

export type DateTimeSchema = AnySchema & {
    type: 'string'
    format: 'date' | 'date-time' | 'time'
}

export type NumberSchema = AnySchema & {
    type: 'number' | 'integer'
}

export type SelectSchema = AnySchema & {
    enum: unknown[]
}

export type StringSchema = AnySchema & {
    type: 'string'
}

export type KnownSchema =
    | BooleanSchema
    | DateTimeSchema
    | NumberSchema
    | SelectSchema
    | StringSchema
