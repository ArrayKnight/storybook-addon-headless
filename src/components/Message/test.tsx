import { convert, ThemeProvider, themes } from '@storybook/theming'
import {
    cleanup,
    fireEvent,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { Message, Props, TEST_IDS } from '.'

describe('Message', () => {
    afterEach(cleanup)

    function setup({
        children = null,
        ...rest
    }: Partial<Props> = {}): RenderResult & {
        props: Props
    } {
        const props: Props = {
            children,
            ...rest,
        }

        return {
            ...render(
                <ThemeProvider theme={convert(themes.normal)}>
                    <Message {...rest}>{children}</Message>
                </ThemeProvider>,
            ),
            props,
        }
    }

    it('should render null when children is falsy', () => {
        const { queryByTestId } = setup()

        expect(queryByTestId(TEST_IDS.root)).not.toBeInTheDocument()
    })

    it('should render message content', () => {
        const testId = 'CustomContent'
        const { getByTestId } = setup({
            children: <span data-testid={testId}>Foo</span>,
        })

        expect(getByTestId(TEST_IDS.root)).toBeInTheDocument()
        expect(getByTestId(TEST_IDS.content)).toBeInTheDocument()
        expect(getByTestId(testId)).toBeInTheDocument()
    })

    it('should render toggle if collapsible', () => {
        const { getByTestId } = setup({
            children: 'Foo',
            collapsible: true,
        })

        expect(getByTestId(TEST_IDS.toggle)).toBeInTheDocument()
        expect(getByTestId(TEST_IDS.toggle)).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })

    it('should render expanded, if collapsed is false', () => {
        const { getByTestId } = setup({
            children: 'Foo',
            collapsible: true,
            collapsed: false,
        })

        expect(getByTestId(TEST_IDS.toggle)).toHaveAttribute(
            'aria-expanded',
            'true',
        )
    })

    it('should toggle collapsed state on click', () => {
        const { getByTestId } = setup({
            children: 'Foo',
            collapsible: true,
        })

        expect(getByTestId(TEST_IDS.toggle)).toHaveAttribute(
            'aria-expanded',
            'false',
        )

        fireEvent.click(getByTestId(TEST_IDS.toggle))

        expect(getByTestId(TEST_IDS.toggle)).toHaveAttribute(
            'aria-expanded',
            'true',
        )

        fireEvent.click(getByTestId(TEST_IDS.toggle))

        expect(getByTestId(TEST_IDS.toggle)).toHaveAttribute(
            'aria-expanded',
            'false',
        )

        // TODO test that the icon is correct
    })
})
