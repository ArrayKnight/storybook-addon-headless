import { gql } from '@apollo/client'

import {
    convertToItem,
    errorToJSON,
    functionToTag,
    getBaseOptions,
    getGraphQLUri,
    getRestfulUrl,
    getVariableType,
    hasOwnProperty,
    isArray,
    isBoolean,
    isBooleanSchema,
    isDateTimeSchema,
    isDocumentNode,
    isFunction,
    isGraphQLParameters,
    isItem,
    isNil,
    isNull,
    isNumber,
    isNumberSchema,
    isObject,
    isObjectLike,
    isRestfulParameters,
    isSelectSchema,
    isString,
    isStringSchema,
    isUndefined,
    noopTransform,
    objectToTag,
    pack,
    unpack,
} from './utilities'

const valuesMap = {
    Array: [] as unknown[],
    Boolean: true,
    Class: class ClassValue {},
    Function: function FunctionValue() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    Lambda: (): null => null,
    Null: null as null,
    NaN: NaN,
    Number: 42,
    Object: {},
    String: 'foo',
    Undefined: undefined as undefined,
    WrappedBoolean: new Boolean(true),
    WrappedNumber: new Number(52),
    WrappedString: new String('foo'),
}
const values = Object.entries(valuesMap) as Array<
    [keyof typeof valuesMap, typeof valuesMap[keyof typeof valuesMap]]
>
const valuesAreOfType = values.reduce(
    (acc, [key]) => ({ ...acc, [key]: false }),
    {} as Record<keyof typeof valuesMap, boolean>,
)

describe('convertToItem', () => {
    it('should convert value to item', () => {
        const entries = [
            ['True', true],
            ['False', false],
            ['Null', null],
            ['Undefined', undefined],
            ['42', 42],
            ['Foo', 'foo'],
            ['Unhandled item conversion', ['foo']],
            ['Unhandled item conversion', {}],
        ]

        entries.forEach(([label, value]) => {
            expect(
                convertToItem(value),
                `Failed to convert item: ${label}, ${value}`,
            ).toEqual({
                label,
                value,
            })
        })
    })

    it('should pass through item value', () => {
        const item = { label: 'Foo', value: 'foo' }

        expect(convertToItem(item)).toEqual(item)
    })
})

describe('errorToJSON', () => {
    it('should convert error to object', () => {
        const { message, stack } = errorToJSON(new Error('Foo'))

        expect(message).toEqual('Foo')
        expect(stack).toEqual(expect.any(String))
    })
})

describe('functionToTag', () => {
    it('should convert function to tag', () => {
        expect(functionToTag(function Foo() {})).toEqual('function Foo() { }') // eslint-disable-line @typescript-eslint/no-empty-function
    })
})

describe('getBaseOptions', () => {
    const defaultOptions = { id: 'default' }
    const otherOptions = { id: 'other' }
    const options = [defaultOptions, otherOptions]

    it('should return only base options', () => {
        const option = { uri: 'foo' }

        expect(getBaseOptions(option, {})).toEqual(option)
        expect(getBaseOptions(option, { base: 'default' })).toEqual(option)
        expect(getBaseOptions(option, { base: 'unknown' })).toEqual(option)
    })

    it('should return default base options', () => {
        expect(getBaseOptions(options, {})).toEqual(defaultOptions)
        expect(getBaseOptions(options, { base: 'default' })).toEqual(
            defaultOptions,
        )
    })

    it('should return specific base options', () => {
        expect(getBaseOptions(options, { base: 'other' })).toEqual(otherOptions)
    })

    it('should return empty options for unknown base', () => {
        expect(getBaseOptions(options, { base: 'unknown' })).toEqual({})
    })
})

describe('getGraphQLUri', () => {
    it('should return uri', () => {
        const uri = 'https://www.foo.bar'
        const query = `
            {
                Foo {
                    id
                    bar
                }
            }
        `
        // Remove first 12 spaces because the query above is indented that far
        const queryShiftedLeft = query.replace(/^ {12}/gm, '')

        expect(
            getGraphQLUri(
                { uri },
                {
                    query: pack(gql(query)),
                },
            ),
        ).toEqual(`${uri}\r\n${queryShiftedLeft}`)
    })
})

describe('getRestfulUrl', () => {
    const baseURL = 'https://www.foo.bar/api'

    it('should return url', () => {
        const query = '/bar'

        expect(getRestfulUrl({ baseURL }, { query }, {})).toEqual(
            `${baseURL}${query}`,
        )
    })

    it('should return url with variables', () => {
        const query = '/bar/{id}'

        expect(getRestfulUrl({ baseURL }, { query }, { id: 42 })).toEqual(
            `${baseURL}/bar/42`,
        )
    })
})

describe.skip('getVariableType', () => {
    it('should', () => {
        expect(getVariableType)
    })
})

describe.skip('hasOwnProperty', () => {
    it('should', () => {
        expect(hasOwnProperty)
    })
})

describe('isArray', () => {
    it('should return if value is an array', () => {
        const valuesAreArray = {
            ...valuesAreOfType,
            Array: true,
        }

        values.forEach(([key, value]) => {
            expect(isArray(value), key).toEqual(valuesAreArray[key])
        })
    })
})

describe('isBoolean', () => {
    it('should return if value is a boolean', () => {
        const valuesAreBoolean = {
            ...valuesAreOfType,
            Boolean: true,
        }

        values.forEach(([key, value]) => {
            expect(isBoolean(value), key).toEqual(valuesAreBoolean[key])
        })
    })
})

describe.skip('isBooleanSchema', () => {
    it('should', () => {
        expect(isBooleanSchema)
    })
})

describe.skip('isDateTimeSchema', () => {
    it('should', () => {
        expect(isDateTimeSchema)
    })
})

describe.skip('isDocumentNode', () => {
    it('should', () => {
        expect(isDocumentNode)
    })
})

describe('isFunction', () => {
    it('should return if value is a function', () => {
        const valuesAreFunction = {
            ...valuesAreOfType,
            Class: true,
            Function: true,
            Lambda: true,
        }

        values.forEach(([key, value]) => {
            expect(isFunction(value), key).toEqual(valuesAreFunction[key])
        })
    })
})

describe.skip('isGraphQLParameters', () => {
    it('should', () => {
        expect(isGraphQLParameters)
    })
})

describe('isItem', () => {
    it('should return if value is an item', () => {
        const invalidObjects = [
            { foo: 'bar' }, // missing label + value
            { value: false }, // missing label
            { label: 'Foo' }, // missing value
            { label: true, value: false }, // label is wrong type
        ]

        values.forEach(([key, value]) => {
            expect(isItem(value), key).toBeFalsy()
        })

        invalidObjects.forEach((value) => {
            expect(isItem(value), `${value}`).toBeFalsy()
        })

        expect(isItem({ label: 'Foo', value: true })).toBeTruthy()
    })
})

describe('isNil', () => {
    it('should return if value is null or undefined', () => {
        const valuesAreNil = {
            ...valuesAreOfType,
            Null: true,
            Undefined: true,
        }

        values.forEach(([key, value]) => {
            expect(isNil(value), key).toEqual(valuesAreNil[key])
        })
    })
})

describe('isNull', () => {
    it('should return if value is null', () => {
        const valuesAreNull = {
            ...valuesAreOfType,
            Null: true,
        }

        values.forEach(([key, value]) => {
            expect(isNull(value), key).toEqual(valuesAreNull[key])
        })
    })
})

describe('isNumber', () => {
    it('should return if value is a number, but not NaN', () => {
        const valuesAreNumber = {
            ...valuesAreOfType,
            Number: true,
        }

        values.forEach(([key, value]) => {
            expect(isNumber(value), key).toEqual(valuesAreNumber[key])
        })
    })
})

describe.skip('isNumberSchema', () => {
    it('should', () => {
        expect(isNumberSchema)
    })
})

describe('isObject', () => {
    it('should return if value is an object', () => {
        const valuesAreObject = {
            ...valuesAreOfType,
            Object: true,
        }

        values.forEach(([key, value]) => {
            expect(isObject(value), key).toEqual(valuesAreObject[key])
        })
    })
})

describe('isObjectLike', () => {
    it('should return if value is an object or object wrapped', () => {
        const valuesAreObjectLike = {
            ...valuesAreOfType,
            Array: true,
            Object: true,
            WrappedBoolean: true,
            WrappedNumber: true,
            WrappedString: true,
        }

        values.forEach(([key, value]) => {
            expect(isObjectLike(value), key).toEqual(valuesAreObjectLike[key])
        })
    })
})

describe.skip('isRestfulParameters', () => {
    it('should', () => {
        expect(isRestfulParameters)
    })
})

describe.skip('isSelectSchema', () => {
    it('should', () => {
        expect(isSelectSchema)
    })
})

describe('isString', () => {
    it('should return if value is a string', () => {
        const valuesAreString = {
            ...valuesAreOfType,
            String: true,
        }

        values.forEach(([key, value]) => {
            expect(isString(value), key).toEqual(valuesAreString[key])
        })
    })
})

describe.skip('isStringSchema', () => {
    it('should', () => {
        expect(isStringSchema)
    })
})

describe('isUndefined', () => {
    it('should return if value is undefined', () => {
        const valuesAreUndefined = {
            ...valuesAreOfType,
            Undefined: true,
        }

        values.forEach(([key, value]) => {
            expect(isUndefined(value), key).toEqual(valuesAreUndefined[key])
        })
    })
})

describe('noopTransform', () => {
    it('should return the value', () => {
        values.forEach(([key, value]) => {
            expect(noopTransform(value), key).toBe(value)
        })
    })
})

describe('objectToTag', () => {
    it('should convert object to tag', () => {
        expect(objectToTag({})).toEqual('[object Object]')
    })
})

describe.skip('pack', () => {
    it('should', () => {
        expect(pack)
    })
})

describe.skip('unpack', () => {
    it('should', () => {
        expect(unpack)
    })
})
