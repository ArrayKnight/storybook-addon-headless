import Ajv from 'ajv'

import { Document, NumberSchema, Schema, StringSchema } from './types'

export function functionToTag(func: Function): string {
    return Function.prototype.toString.call(func)
}

export function objectToTag(obj: object): string {
    return Object.prototype.toString.call(obj)
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function'
}

export function isNull(value: any): value is null {
    return value === null
}

export function isNumberSchema(value: any): value is NumberSchema {
    return (
        isObject<Schema>(value) &&
        (value.type === 'integer' || value.type === 'number')
    )
}

export function isObject<T extends {}>(value: any): value is T {
    if (!isObjectLike(value) || objectToTag(value) !== '[object Object]') {
        return false
    }

    const prototype = Object.getPrototypeOf(Object(value))

    if (isNull(prototype)) {
        return true
    }

    const Ctor =
        Object.prototype.hasOwnProperty.call(prototype, 'constructor') &&
        prototype.constructor

    return (
        isFunction(Ctor) &&
        Ctor instanceof Ctor &&
        functionToTag(Ctor) === functionToTag(Object)
    )
}

export function isObjectLike(value: any): boolean {
    return !isNull(value) && typeof value === 'object'
}

const validateDocument = new Ajv().compile({
    type: 'object',
    properties: {
        kind: {
            type: 'string',
            pattern: '^Document$',
        },
        definitions: {
            type: 'array',
            items: {
                type: 'object',
                // TODO any more validation necessary?
            },
            minItems: 1,
        },
        loc: {
            type: 'object',
            properties: {
                start: {
                    type: 'integer',
                },
                end: {
                    type: 'integer',
                },
            },
            required: ['start', 'end'],
        },
    },
    required: ['kind', 'definitions', 'loc'],
})

export function isQuery(value: any): value is Document {
    return isObject<Document>(value) && !!validateDocument(value)
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isStringSchema(value: any): value is StringSchema {
    return isObject<Schema>(value) && value.type === 'string'
}
