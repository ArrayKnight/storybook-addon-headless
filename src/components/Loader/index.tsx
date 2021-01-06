import { Loader as LoaderBase } from '@storybook/components'
import {
    convert,
    createReset,
    Global,
    ThemeProvider,
    themes,
} from '@storybook/theming'
import React, { memo, ReactElement } from 'react'
import ReactDOM from 'react-dom'

export const TEST_IDS = Object.freeze({
    root: 'LoaderRoot',
})

export const Loader = memo(
    (): ReactElement => {
        const theme = convert(themes.normal)

        return (
            <ThemeProvider theme={theme}>
                <Global styles={createReset(theme)} />
                <LoaderBase data-testid={TEST_IDS.root} />
            </ThemeProvider>
        )
    },
)

Loader.displayName = 'Loader'

export function useHeadlessLoader(element: HTMLElement): void {
    ReactDOM.render(<Loader />, element)
}
