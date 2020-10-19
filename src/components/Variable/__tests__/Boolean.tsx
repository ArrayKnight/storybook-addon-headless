import {
    cleanup,
    fireEvent,
    getNodeText,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { BooleanInput, Props, TEST_IDS } from '../Boolean'

describe('Boolean', () => {
    afterEach(cleanup)

    function setup({
        schema = { type: 'boolean' },
        value = false,
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
            ...render(<BooleanInput {...props} />),
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
        const input = getByTestId(TEST_IDS.input)

        expect(input).not.toBeChecked()

        fireEvent.click(input)

        expect(input).not.toBeChecked()
        expect(props.onChange).toHaveBeenCalledWith(true)

        rerender(<BooleanInput {...props} value={true} />)

        expect(input).toBeChecked()
        expect(props.onChange).toHaveBeenCalledTimes(1)
    })
})
