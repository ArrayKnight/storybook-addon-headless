import { addDecorator } from '@storybook/react'
import {
    convert,
    createReset,
    Global,
    ThemeProvider,
    themes,
} from '@storybook/theming'
import React from 'react'

addDecorator((storyFn) => (
    <ThemeProvider theme={convert(themes.normal)}>
        <Global styles={createReset} />
        {storyFn()}
    </ThemeProvider>
))
