import { describe } from '@jest/globals'
import { convert, ThemeProvider, themes } from '@storybook/theming'
import {
    cleanup,
    fireEvent,
    getNodeText,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
    DateTimeInput,
    DateTimeType,
    parseDateTime,
    Props,
    TEST_IDS,
    toInputFormat,
    toISOFormat,
} from '../Date'

const iso = '2020-10-19T20:30:00.000Z'
const date = new Date(iso)

describe.skip('parseDateTime', () => {
    it('should return a date', () => {
        const now = new Date()

        expect(parseDateTime(iso, DateTimeType.DateTime, true)).toEqual(date)
        expect(parseDateTime(iso, DateTimeType.Date, true)).toEqual(date)
        expect(parseDateTime('20:30:00', DateTimeType.Time, true)).toEqual(
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                20 - now.getTimezoneOffset() / 60,
                30,
                0,
                0,
            ),
        )
        expect(parseDateTime('20:30:00', DateTimeType.Time, false)).toEqual(
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                20,
                30,
                0,
                0,
            ),
        )
    })
})

describe.skip('toInputFormat', () => {
    it('should return an empty string', () => {
        expect(toInputFormat(undefined, DateTimeType.DateTime)).toEqual('')
        expect(toInputFormat(undefined, DateTimeType.Date)).toEqual('')
        expect(toInputFormat(undefined, DateTimeType.Time)).toEqual('')
    })

    it('should return a local-time date-time string', () => {
        expect(toInputFormat(iso, DateTimeType.DateTime)).toEqual(
            '2020-10-19T13:30:00',
        )
    })

    it('should return a date string', () => {
        expect(toInputFormat(iso, DateTimeType.Date)).toEqual('2020-10-19')
    })

    it('should return a time string', () => {
        expect(toInputFormat(iso, DateTimeType.Time)).toEqual('20:30:00')
    })
})

describe.skip('toISOFormat', () => {
    it('should return a date-time string', () => {
        expect(
            toISOFormat('2020-10-19T13:30:00', DateTimeType.DateTime),
        ).toEqual(iso)
    })

    it('should return a date string', () => {
        expect(toISOFormat('2020-10-19', DateTimeType.Date)).toEqual(
            '2020-10-19',
        )
    })

    it('should return a time string', () => {
        expect(toISOFormat('13:30:00', DateTimeType.Time)).toEqual('20:30:00')
    })
})

describe('DateTime', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'string', format: 'date-time' },
        value,
        error = null,
        isValid = true,
        onChange = jest.fn(),
    }: Partial<Props> = {}): RenderResult & {
        props: Props
    } {
        const props: Props = {
            schema,
            value,
            error,
            isValid,
            onChange,
        }

        return {
            ...render(
                <ThemeProvider theme={convert(themes.normal)}>
                    <DateTimeInput {...props} />
                </ThemeProvider>,
            ),
            props,
        }
    }

    it('should render', () => {
        const { getByTestId } = setup()

        expect(getByTestId(TEST_IDS.root)).toBeInTheDocument()
    })

    it('should render error when invalid', () => {
        const error = 'Error message'
        const { getByTestId } = setup({
            isValid: false,
            error,
        })

        expect(getByTestId(TEST_IDS.error)).toBeInTheDocument()
        expect(getNodeText(getByTestId(TEST_IDS.error))).toEqual(error)
    })

    it.skip('should be a controlled input', () => {
        const { getByTestId, props, rerender } = setup()
        const input = getByTestId(TEST_IDS.input) as HTMLInputElement

        expect(input.value).toEqual('')

        fireEvent.change(input, {
            target: { value: toInputFormat(iso, DateTimeType.DateTime) },
        })

        expect(input.value).toEqual('')
        expect(props.onChange).toHaveBeenCalledWith(iso)

        rerender(
            <ThemeProvider theme={convert(themes.normal)}>
                <DateTimeInput {...props} value={iso} />
            </ThemeProvider>,
        )

        expect(toISOFormat(input.value, DateTimeType.DateTime)).toEqual(
            toISOFormat(iso, DateTimeType.DateTime),
        )
        expect(props.onChange).toHaveBeenCalledTimes(1)
    })
})
