import { convert, ThemeProvider, themes } from '@storybook/theming'
import { cleanup, render, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import mockConsole from 'jest-mock-console'
import React from 'react'

import { UnknownInput, MESSAGE, Props, TEST_IDS } from '../Unknown'

describe('Unknown', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'unknown' },
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
                    <UnknownInput {...props} />
                </ThemeProvider>,
            ),
            props,
        }
    }

    it('should render', () => {
        mockConsole()

        const {
            getByTestId,
            props: { schema, value },
        } = setup()

        expect(getByTestId(TEST_IDS.root)).toBeInTheDocument()

        expect(console.warn).toHaveBeenCalledWith(MESSAGE, { schema, value })
    })
})
