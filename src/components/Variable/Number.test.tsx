import {
    cleanup,
    fireEvent,
    getNodeText,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { NumberInput, Props, TEST_IDS } from './Number'
import { convert, ThemeProvider, themes } from '@storybook/theming'

describe('Number', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'number' },
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
                    <NumberInput {...props} />
                </ThemeProvider>,
            ),
            props,
        }
    }

    it('should render', () => {
        const { queryByTestId } = setup()

        expect(queryByTestId(TEST_IDS.root)).toBeInTheDocument()
    })

    it('should render error when invalid', () => {
        const error = 'Error message'
        const { getByTestId, queryByTestId } = setup({
            isValid: false,
            error,
        })

        expect(queryByTestId(TEST_IDS.error)).toBeInTheDocument()
        expect(getNodeText(getByTestId(TEST_IDS.error))).toEqual(error)
    })

    it('should be a controlled input', () => {
        const { getByTestId, props, rerender } = setup()
        const input = getByTestId(TEST_IDS.input) as HTMLInputElement
        const value = 42

        expect(input.value).toEqual('')

        fireEvent.change(input, { target: { value } })

        expect(input.value).toEqual('')
        expect(props.onChange).toHaveBeenCalledWith(value)

        rerender(
            <ThemeProvider theme={convert(themes.normal)}>
                <NumberInput {...props} value={value} />
            </ThemeProvider>,
        )

        expect(input.value).toEqual(`${value}`)
        expect(props.onChange).toHaveBeenCalledTimes(1)
    })
})
