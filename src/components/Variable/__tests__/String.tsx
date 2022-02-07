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

import { StringInput, Props, TEST_IDS } from '../String'

describe('String', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'string' },
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
                    <StringInput {...props} />
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

    it('should be a controlled input', () => {
        const { getByTestId, props, rerender } = setup()
        const input = getByTestId(TEST_IDS.input) as HTMLInputElement
        const value = 'foo'

        expect(input.value).toEqual('')

        fireEvent.change(input, { target: { value } })

        expect(input.value).toEqual('')
        expect(props.onChange).toHaveBeenCalledWith(value)

        rerender(
            <ThemeProvider theme={convert(themes.normal)}>
                <StringInput {...props} value={value} />
            </ThemeProvider>,
        )

        expect(input.value).toEqual(value)
        expect(props.onChange).toHaveBeenCalledTimes(1)
    })
})
