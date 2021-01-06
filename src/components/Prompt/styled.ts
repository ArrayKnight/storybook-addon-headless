import { css, styled } from '@storybook/theming'

export const Root = styled.div(
    ({ theme }) => css`
        width: 100%;
        min-height: 100%;
        background: ${theme.background.app};
        position: absolute;

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
