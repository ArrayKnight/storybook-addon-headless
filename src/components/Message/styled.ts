import { background, color, css, styled } from '@storybook/theming'
import { darken, lighten } from 'polished'

export const Root = styled.div(
    ({ theme }) => css`
        padding: 0.42em 1em;
        border: 1px solid ${color.border};
        border-radius: ${theme.appBorderRadius}px;
        background: ${theme.base === 'light'
            ? lighten(0.015, background.app)
            : darken(0.015, background.app)};
    `,
)
