import { convert, ThemeProvider, themes } from '@storybook/theming'
import {
    cleanup,
    getNodeText,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { SelectInput, Props, TEST_IDS } from '../Select'

describe('Select', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'string', enum: ['foo', 'bar', 'wux'] },
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
                    <SelectInput {...props} />
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
        // const { getByTestId, props, rerender } = setup()
    })
})
