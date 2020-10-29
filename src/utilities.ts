import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client'
import Ajv from 'ajv'
import defineKeywords from 'ajv-keywords'
import axios, { AxiosPromise } from 'axios'
import { sentenceCase } from 'change-case'
import qs from 'qs'
import { useEffect, useState } from 'react'

import {
    BaseParameters,
    BooleanSchema,
    DateTimeSchema,
    GraphQLOptions,
    GraphQLOptionsTypes,
    GraphQLParameters,
    Item,
    NumberSchema,
    OneOrMore,
    PackedDocumentNode,
    RestfulOptions,
    RestfulOptionsTypes,
    RestfulParameters,
    Schema,
    SelectSchema,
    StringSchema,
    VariableType,
} from './types'

export const ajv = new Ajv({ $data: true })

defineKeywords(ajv)

export function convertToItem(value: unknown): Item {
    switch (true) {
        case isBoolean(value):
        case isNil(value):
        case isNumber(value):
        case isString(value):
            return {
                label: isNumber(value) ? `${value}` : sentenceCase(`${value}`),
                value,
            }

        case isItem(value):
            return value as Item

        default:
            return {
                label: 'Unhandled item conversion',
                value,
            }
    }
}

export function errorToJSON(error: Error): Record<string, unknown> {
    return Object.getOwnPropertyNames(error).reduce(
        (obj, key) => ({
            ...obj,
            [key]: error[key as keyof Error],
        }),
        {},
    )
}

export async function fetchViaGraphQL(
    options: GraphQLOptionsTypes,
    parameters: GraphQLParameters,
    variables: Record<string, unknown>,
): Promise<unknown> {
    const opts = getBaseOptions(options, parameters)
    const { config = {}, query } = parameters
    const instance = new ApolloClient({
        ...opts,
        ...config,
        cache: new InMemoryCache(),
    })

    const { data, error, errors } = await instance.query<unknown>({
        query: unpack(query),
        variables,
        fetchPolicy: 'network-only',
    })

    if (error || (errors && errors.length)) {
        throw error || errors[0]
    }

    return data
}

export async function fetchViaRestful(
    options: RestfulOptionsTypes,
    parameters: RestfulParameters,
    variables: Record<string, unknown>,
): Promise<unknown> {
    const { config = {}, convertToFormData } = parameters
    const opts = getBaseOptions(options, parameters)
    const formData = new FormData()

    if (convertToFormData) {
        Object.entries(variables).forEach(([key, value]) => {
            formData.append(
                key,
                isString(value) || value instanceof Blob
                    ? value
                    : JSON.stringify(value),
            )
        })
    }

    const { data } = await (axios({
        url: getRestfulUrl(opts, parameters, variables),
        ...opts,
        ...config,
        data: convertToFormData ? formData : variables,
    }) as AxiosPromise<unknown>)

    return data
}

export function functionToTag(func: (...args: unknown[]) => unknown): string {
    return Function.prototype.toString.call(func)
}

export function getBaseOptions<T = GraphQLOptions | RestfulOptions>(
    options: OneOrMore<T>,
    { base }: BaseParameters,
): T {
    if (isArray(options)) {
        const name = base || 'default'

        return options.find(({ id }) => id === name) || ({} as T)
    }

    return options
}

export function getGraphQLUri(
    options: GraphQLOptionsTypes,
    parameters: GraphQLParameters,
): string {
    const base =
        { ...getBaseOptions(options, parameters), ...(parameters.config || {}) }
            .uri || ''
    let query = parameters.query.source
    const match = /([ \t]+)[^\s]/.exec(query)

    if (!isNull(match)) {
        const [, space] = match

        query = query.replace(new RegExp(`^${space}`, 'gm'), '')
    }

    return query ? `${base}\r\n${query}` : `${base}`
}

export function getRestfulUrl(
    options: RestfulOptionsTypes,
    parameters: RestfulParameters,
    variables: Record<string, unknown>,
): string {
    const base =
        { ...getBaseOptions(options, parameters), ...(parameters.config || {}) }
            .baseURL || ''
    const path = Object.entries(variables).reduce(
        (url, [name, value]) => url.replace(`{${name}}`, `${value}`),
        parameters.query,
    )

    return `${base}${path}`
}

export function getVariableType(schema: Schema): VariableType {
    switch (true) {
        case isBooleanSchema(schema):
            return VariableType.Boolean

        case isDateTimeSchema(schema):
            return VariableType.Date

        case isNumberSchema(schema):
            return VariableType.Number

        case isSelectSchema(schema):
            return VariableType.Select

        case isStringSchema(schema):
            return VariableType.String

        default:
            return VariableType.Unknown
    }
}

export function generateUrl(path: string): string {
    const { location } = document
    const query = qs.parse(location.search, { ignoreQueryPrefix: true })

    return `${location.origin + location.pathname}?${qs.stringify(
        { ...query, path },
        { encode: false },
    )}`
}

export function hasOwnProperty(instance: unknown, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(instance, property)
}

export function isArray<T = unknown>(value: unknown): value is T[] {
    return Array.isArray(value)
}

export function isBoolean(value: unknown): value is boolean {
    return value === true || value === false
}

export function isBooleanSchema(value: unknown): value is BooleanSchema {
    return isObject<Schema>(value) && value.type === 'boolean'
}

export function isDateTimeSchema(value: unknown): value is DateTimeSchema {
    return (
        isObject<Schema>(value) &&
        (value.format === 'date' ||
            value.format === 'date-time' ||
            value.format === 'time')
    )
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
        source: {
            type: 'string',
        },
    },
    required: ['kind', 'definitions'],
})

export function isDocumentNode(
    value: unknown,
): value is DocumentNode | PackedDocumentNode {
    return !!validateDocument(value)
}

export function isFunction(
    value: unknown,
): value is (...args: unknown[]) => unknown {
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

export function isGraphQLParameters(
    value: unknown,
): value is GraphQLParameters {
    return (
        !!validateGraphQLParameters(value) &&
        isDocumentNode((value as GraphQLParameters).query)
    )
}

export function isItem(value: unknown): value is Item {
    return (
        isObject(value) &&
        hasOwnProperty(value, 'label') &&
        isString((value as { label: unknown }).label) &&
        hasOwnProperty(value, 'value')
    )
}

export function isNil(value: unknown): value is null | undefined {
    return isNull(value) || isUndefined(value)
}

export function isNull(value: unknown): value is null {
    return value === null
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value)
}

export function isNumberSchema(value: unknown): value is NumberSchema {
    return (
        isObject<Schema>(value) &&
        (value.type === 'integer' || value.type === 'number')
    )
}

export function isObject<T extends unknown>(value: unknown): value is T {
    if (!isObjectLike(value) || objectToTag(value) !== '[object Object]') {
        return false
    }

    const prototype = Object.getPrototypeOf(Object(value)) as unknown

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

export function isObjectLike(value: unknown): boolean {
    return !isNull(value) && typeof value === 'object'
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

export function isRestfulParameters(
    value: unknown,
): value is RestfulParameters {
    return !!validateRestfulParameters(value)
}

export function isSelectSchema(value: unknown): value is SelectSchema {
    return (
        isObject<Schema>(value) && isArray(value.enum) && value.enum.length > 1
    )
}

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isStringSchema(value: unknown): value is StringSchema {
    return isObject<Schema>(value) && value.type === 'string'
}

export function isUndefined(value: unknown): value is undefined {
    return value === undefined
}

export function noopTransform<T = unknown>(value: T): T {
    return value
}

export function objectToTag(value: unknown): string {
    return Object.prototype.toString.call(value)
}

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
        source: loc?.source.body,
    }
}

export function unpack({
    kind,
    definitions,
}: PackedDocumentNode): DocumentNode {
    return {
        kind,
        definitions: definitions.map((definition) => JSON.parse(definition)),
    }
}

export function useImmediateEffect(effect: () => void): void {
    const [complete, setComplete] = useState(false)

    if (complete) {
        effect()
    }

    useEffect(() => setComplete(true), [])
}
