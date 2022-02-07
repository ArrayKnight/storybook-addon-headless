import addons from '@storybook/addons'
import { Form, Icons } from '@storybook/components'
import {
    convert,
    createReset,
    Global,
    ThemeProvider,
    themes,
} from '@storybook/theming'
import React, { memo, ReactElement, ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { PANEL_TITLE, EVENT_REQUESTED_ADDON } from '../../config'
import { Root, Content } from './styled'

export interface Props {
    headline?: ReactNode
    message?: ReactNode
}

export const TEST_IDS = Object.freeze({
    root: 'PromptRoot',
    headline: 'PromptHeadline',
    message: 'PromptMessage',
    button: 'PromptButton',
})

export const Prompt = memo(({ headline = <h2>
            Something is missing...
        </h2>, message = <p>
            This component story relies on data fetched from an API. Head over to the {PANEL_TITLE} tab to configure and execute the API call. Once the data has been fetched, head on back here and the component story should be rendered.
        </p> }: Props): ReactElement => {
    const theme = convert(themes.normal)

    function emit(): void {
        addons.getChannel().emit(EVENT_REQUESTED_ADDON)
    }

    return (
        <ThemeProvider theme={theme}>
            <Global styles={createReset(theme)} />
            <Global styles={`body {padding: 0 !important;}`} />
            <Root data-testid={TEST_IDS.root}>
                <Content>
                    {headline && (
                        <div data-testid={TEST_IDS.headline}>{headline}</div>
                    )}
                    {message && (
                        <div data-testid={TEST_IDS.message}>{message}</div>
                    )}
                    <Form.Button onClick={emit} data-testid={TEST_IDS.button}>
                        <span>Continue</span>
                        <Icons icon="arrowright" />
                    </Form.Button>
                </Content>
            </Root>
        </ThemeProvider>
    )
})

Prompt.displayName = 'Prompt'

export function useHeadlessPrompt(
    element: HTMLElement,
    props: Partial<Props> = {},
): void {
    ReactDOM.render(<Prompt {...props} />, element)
}
