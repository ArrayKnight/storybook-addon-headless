import { background, color, css, styled } from '@storybook/theming'

export const Root = styled.div(
    ({ theme }) => css`
        max-height: ${theme.isCollapsed ? '30px' : '600px'};
        padding: 0.42em 1em;
        border: 1px solid ${color.border};
        border-radius: ${theme.appBorderRadius}px;
        position: relative;
        transition: max-height 500ms;
        overflow: ${theme.isCollapsed ? 'hidden' : 'auto'};

        &:before {
            content: '';
            width: 100%;
            height: 100%;
            background: ${background.app};
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            opacity: 0.5;
        }
    `,
)

export const Pre = styled.pre`
    padding: 0;
    margin: 0;
    position: relative;
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
