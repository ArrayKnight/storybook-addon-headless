import Ajv from 'ajv'
import ApolloClient, { DocumentNode } from 'apollo-boost'
import axios from 'axios'
import { Source } from 'graphql'

import {
    Dictionary,
    GraphQLOptions,
    GraphQLParameters,
    NumberSchema,
    PackedDocumentNode,
    RestfulOptions,
    RestfulParameters,
    Schema,
    StringSchema,
} from './types'

const ajv = new Ajv()

export function createGraphQLPromise(
    options: GraphQLOptions,
    { config = {}, query }: GraphQLParameters,
    variables: Dictionary,
): Promise<any> {
    const instance = new ApolloClient({
        ...options,
        ...config,
    })

    return new Promise((resolve, reject) => {
        instance
            .query({
                query: unpack(query),
                variables,
                fetchPolicy: 'network-only',
            })
            .then(({ data, errors }) => {
                if (!!errors) {
                    reject(errors)
                } else {
                    resolve(data)
                }
            }, reject)
    })
}

export function createRestfulPromise(
    options: RestfulOptions,
    parameters: RestfulParameters,
    variables: Dictionary,
): Promise<any> {
    const { config = {}, convertToFormData } = parameters

    return axios({
        url: getRestfulUrl(options, parameters, variables, false),
        ...options,
        ...config,
        data: convertToFormData
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

export function getGraphQLUri(
    options: GraphQLOptions,
    parameters: GraphQLParameters,
): string {
    const base = { ...options, ...(parameters.config || {}) }.uri || ''
    // TODO determine if there's any value in revealing more about the query
    /*const defs = parameters.query.definitions.reduce(
        (operations, definition) => {
            if (
                definition.kind === 'OperationDefinition' &&
                !isUndefined(definition.name)
            ) {
                return [
                    ...operations,
                    `${definition.operation} { ${definition.name.value} }`,
                ]
            }

            return operations
        },
        [],
    )*/

    return `${base}`
}

export function getRestfulUrl(
    options: RestfulOptions,
    parameters: RestfulParameters,
    variables: Dictionary,
    absolute: boolean,
): string {
    const base = { ...options, ...(parameters.config || {}) }.baseURL || ''
    const path = Object.entries(variables).reduce(
        (url, [name, value]) => url.replace(`{${name}}`, value),
        parameters.query,
    )

    return absolute ? `${base}${path}` : path
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
    required: ['query'],
})

export function isGraphQLParameters(value: any): value is GraphQLParameters {
    return !!validateGraphQLParameters(value) && isQuery(value.query)
}

export function isNil(value: any): value is null | undefined {
    return isNull(value) || isUndefined(value)
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

export function isQuery(value: any): value is DocumentNode {
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
    required: ['query'],
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

export function isUndefined(value: any): value is undefined {
    return value === undefined
}

export function objectToTag(obj: object): string {
    return Object.prototype.toString.call(obj)
}

/*
 * Storybook implements telejson which currently parses a max depth of 10:
 * https://github.com/storybookjs/storybook/issues/9534
 *
 * Once the parse call allows for a greater depth of data these functions will be deprecated
 */
export function pack({
    kind,
    definitions,
    loc,
}: DocumentNode): PackedDocumentNode {
    return {
        kind,
        definitions: definitions.map((definition) =>
            JSON.stringify(definition),
        ),
        loc: !isUndefined(loc)
            ? {
                  ...loc,
                  source: Object.getOwnPropertyNames(loc.source).reduce(
                      (obj, key) => ({
                          ...obj,
                          [key]: (loc.source as Dictionary)[key],
                      }),
                      {} as Source,
                  ),
              }
            : loc,
    }
}

export function unpack({
    kind,
    definitions,
    loc,
}: PackedDocumentNode): DocumentNode {
    return {
        kind,
        definitions: definitions.map((definition) => JSON.parse(definition)),
        loc,
    }
}
