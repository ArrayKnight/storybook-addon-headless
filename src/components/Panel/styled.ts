import { css, styled } from '@storybook/theming'

export const Root = styled.div(
    ({ theme }) => css`
        width: 100%;
        min-height: 100%;
        background: ${theme.background.app};
        position: absolute;
        ${!theme.active &&
        css`
            display: none;
            pointer-events: none;
        `}

        *:focus {
            outline: none;
        }
    `,
)

export const Content = styled.div(
    ({ theme }) => css`
        width: 60%;
        min-width: 400px;
        max-width: 800px;
        padding: 20px;
        margin: 20px auto;
        background: ${theme.background.content};
    `,
)

export const TabContent = styled.div`
    padding-top: 10px;
`

export const Separator = styled.hr(
    ({ theme }) => css`
        border: 0;
        height: 20px;
        margin: 20px -20px;
        background: ${theme.background.app};
    `,
)
