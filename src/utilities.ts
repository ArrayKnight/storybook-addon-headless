import Ajv from 'ajv'
import axios from 'axios'

import {
    Dictionary,
    Document,
    GraphQLOptions,
    GraphQLParameters,
    NumberSchema,
    RestfulOptions,
    RestfulParameters,
    Schema,
    StringSchema,
} from './types'

const ajv = new Ajv()

export function createGraphQLPromise(
    options: GraphQLOptions,
    parameters: GraphQLParameters,
    variables: Dictionary,
): Promise<any> {
    // TODO
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve()
            } else {
                reject()
            }
        }, 1000 * 2 * Math.random())
    })
}

export function createRestfulPromise(
    options: RestfulOptions,
    parameters: RestfulParameters,
    variables: Dictionary,
): Promise<any> {
    return axios({
        url: Object.entries(variables).reduce(
            (url, [name, value]) => url.replace(`{${name}}`, value),
            parameters.query,
        ),
        ...(options || {}),
        ...(parameters.config || {}),
        data: parameters.convertToFormData
            ? Object.entries(variables).reduce((data, [key, value]) => {
                  data.append(key, value)

                  return data
              }, new FormData())
            : variables,
    }).then(({ data }) => data)
}

export function errorToJSON(error: Error): Dictionary {
    return Object.getOwnPropertyNames(error).reduce(
        (obj, key) => ({
            ...obj,
            [key]: (error as Dictionary)[key],
        }),
        {},
    )
}

export function functionToTag(func: Function): string {
    return Function.prototype.toString.call(func)
}

export function objectToTag(obj: object): string {
    return Object.prototype.toString.call(obj)
}

export function isFunction(value: any): value is Function {
    return typeof value === 'function'
}

// TODO any more validation necessary?
const validateGraphQLParameters = ajv.compile({
    type: 'object',
    properties: {
        query: {
            type: 'object', // TODO share + reuse schemas (Document for in GraphQLParameters)
        },
        variables: {
            type: 'object',
        },
    },
    required: ['query', 'variables'],
})

export function isGraphQLParameters(value: any): value is GraphQLParameters {
    return !!validateGraphQLParameters(value) && isQuery(value.query)
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

// TODO any more validation necessary?
const validateDocument = ajv.compile({
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
    return !!validateDocument(value)
}

// TODO any more validation necessary?
const validateRestfulParameters = ajv.compile({
    type: 'object',
    properties: {
        query: {
            type: 'string',
        },
        variables: {
            type: 'object',
        },
    },
    required: ['query', 'variables'],
})

export function isRestfulParameters(value: any): value is RestfulParameters {
    return !!validateRestfulParameters(value)
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isStringSchema(value: any): value is StringSchema {
    return isObject<Schema>(value) && value.type === 'string'
}
