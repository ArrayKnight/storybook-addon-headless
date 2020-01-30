export interface Schema extends Object {
    type: string | string[]
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

export interface SelectSchema extends Schema {
    enum: any[]
}

export interface StringSchema extends Schema {
    type: 'string'
}

export type KnownSchema =
    | BooleanSchema
    | DateTimeSchema
    | NumberSchema
    | SelectSchema
    | StringSchema
