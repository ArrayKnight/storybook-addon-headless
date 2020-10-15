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

interface Props {
    headline?: ReactNode
    message?: ReactNode
}

export const Prompt = memo(
    ({
        headline = <h2>Something is missing...</h2>,
        message = (
            <p>
                This component story relies on data fetched from an API. Head
                over to the {PANEL_TITLE} tab to configure and execute the API
                call. Once the data has been fetched, head on back here and the
                component story should be presented.
            </p>
        ),
    }: Props): ReactElement => {
        function goToHeadless(): void {
            addons.getChannel().emit(EVENT_REQUESTED_ADDON)
        }

        return (
            <ThemeProvider theme={convert(themes.normal)}>
                <Global styles={createReset} />
                <Global styles={`body {padding: 0 !important;}`} />
                <Root>
                    <Content>
                        {headline}
                        {message}
                        <Form.Button onClick={goToHeadless}>
                            <span>Continue</span>
                            <Icons icon="arrowright" />
                        </Form.Button>
                    </Content>
                </Root>
            </ThemeProvider>
        )
    },
)

Prompt.displayName = 'Prompt'

export function useHeadlessPrompt(
    element: HTMLElement,
    props: Partial<Props> = {},
): void {
    ReactDOM.render(<Prompt {...props} />, element)
}
