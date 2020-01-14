import { array, number, NumberSchema, object, string, StringSchema } from 'yup'

import { Document } from './types'

export function functionToTag(func: Function): string {
    return Function.prototype.toString.call(func)
}

export function objectToTag(obj: object): string {
    return Object.prototype.toString.call(obj)
}

export function typeToString(type: Function | object): string {
    return isFunction(type)
        ? functionToTag(type).match(/^function (\w+)/)[1]
        : objectToTag(type).match(/^\[object (\w+)/)[1]
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function'
}

export function isNil(value: any): boolean {
    return isNull(value) || isUndefined(value)
}

export function isNull(value: any): value is null {
    return value === null
}

export function isNumberSchema(value: any): value is NumberSchema {
    return (
        !isNil(value) &&
        typeToString(value.constructor) === typeToString(number().constructor)
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

const DocumentSchema = object().shape({
    kind: string()
        .matches(/^Document$/)
        .required(),
    definitions: array()
        .of(
            object().shape({
                kind: string().matches(/^OperationDefinition$/),
                // TODO more validation needed?
            }),
        )
        .required()
        .min(1),
    loc: object()
        .shape({
            start: number()
                .integer()
                .required(),
            end: number()
                .integer()
                .required(),
        })
        .required(),
})

export function isQuery(value: any): value is Document {
    return isObject<Document>(value) && DocumentSchema.isValidSync(value)
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isStringSchema(value: any): value is StringSchema {
    return (
        !isNil(value) &&
        typeToString(value.constructor) === typeToString(string().constructor)
    )
}

export function isUndefined(value: any): value is undefined {
    return value === undefined
}
