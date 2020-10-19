import { cleanup, render, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { Loader, TEST_IDS } from '.'

describe('Loader', () => {
    afterEach(cleanup)

    function setup(): RenderResult {
        return {
            ...render(<Loader />),
        }
    }

    it('should render', () => {
        const { queryByTestId } = setup()

        expect(queryByTestId(TEST_IDS.root)).toBeInTheDocument()
    })
})
