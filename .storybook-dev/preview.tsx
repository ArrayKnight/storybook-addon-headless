import { addDecorator } from '@storybook/react'
import {
    convert,
    createReset,
    Global,
    ThemeProvider,
    themes,
} from '@storybook/theming'
import React from 'react'

addDecorator((storyFn) => {
    const theme = convert(themes.normal)

    return (
        <ThemeProvider theme={theme}>
            <Global styles={createReset(theme)} />
            {storyFn()}
        </ThemeProvider>
    )
})
