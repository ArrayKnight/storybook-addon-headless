import addons from '@storybook/addons'
import {
    cleanup,
    fireEvent,
    render,
    RenderResult,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { EVENT_REQUESTED_ADDON } from '../../config'
import { Prompt, Props, TEST_IDS } from '.'

jest.mock('@storybook/addons', () => {
    const emit = jest.fn()
    const getChannel = jest.fn(() => ({ emit }))

    return {
        getChannel,
    }
})

describe('Prompt', () => {
    afterEach(cleanup)

    const testId = 'CustomTestId'

    function setup(props: Props = {}): RenderResult & { props: Props } {
        return {
            ...render(<Prompt {...props} />),
            props,
        }
    }

    it('should render', () => {
        const { queryByTestId } = setup()

        expect(queryByTestId(TEST_IDS.root)).toBeInTheDocument()
        expect(queryByTestId(TEST_IDS.headline)).toBeInTheDocument()
        expect(queryByTestId(TEST_IDS.message)).toBeInTheDocument()
    })

    it('should render a custom headline', () => {
        const { queryByTestId, rerender } = setup({
            headline: <h1 data-testid={testId}>My Custom Headline</h1>,
        })

        expect(queryByTestId(testId)).toBeInTheDocument()

        rerender(<Prompt headline={null} />)

        expect(queryByTestId(TEST_IDS.headline)).not.toBeInTheDocument()
        expect(queryByTestId(testId)).not.toBeInTheDocument()
    })

    it('should render a custom message', () => {
        const { queryByTestId, rerender } = setup({
            message: <p data-testid={testId}>My custom message</p>,
        })

        expect(queryByTestId(testId)).toBeInTheDocument()

        rerender(<Prompt message={null} />)

        expect(queryByTestId(TEST_IDS.message)).not.toBeInTheDocument()
        expect(queryByTestId(testId)).not.toBeInTheDocument()
    })

    it('should emit event onClick of button', () => {
        const { getByTestId } = setup()

        fireEvent.click(getByTestId(TEST_IDS.button))

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(addons.getChannel().emit).toHaveBeenCalledWith(
            EVENT_REQUESTED_ADDON,
        )
    })
})
