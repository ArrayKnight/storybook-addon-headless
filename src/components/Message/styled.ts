import { background, color, css, styled } from '@storybook/theming'
import { darken, lighten } from 'polished'

export const Root = styled.div(
    ({ theme }) => css`
        max-height: ${theme.isCollapsed ? '30px' : '600px'};
        padding: 0.42em 1em;
        border: 1px solid ${color.border};
        border-radius: ${theme.appBorderRadius}px;
        background: ${theme.base === 'light'
            ? lighten(0.015, background.app)
            : darken(0.015, background.app)};
        position: relative;
        transition: max-height 500ms;
        overflow: ${theme.isCollapsed ? 'hidden' : 'auto'};
    `,
)

export const Pre = styled.pre`
    padding: 0;
    margin: 0;
`

export const Button = styled.button`
    width: 30px;
    height: 30px;
    padding: 5px;
    border: 0;
    background: none;
    position: absolute;
    top: 0;
    right: 0;
    appearance: none;
`
