import { background, css, styled } from '@storybook/theming'

export const Root = styled.div`
    width: 100%;
    min-height: 100%;
    background: ${background.app};
    position: absolute;
    ${({ theme }) =>
        !theme.active &&
        css`
            display: none;
            pointer-events: none;
        `}

    *:focus {
        outline: none;
    }
`

export const Content = styled.div`
    width: 60%;
    min-width: 400px;
    max-width: 800px;
    padding: 20px;
    margin: 20px auto;
    background: ${background.content};
`

export const TabContent = styled.div`
    padding-top: 10px;
`

export const Separator = styled.hr`
    border: 0;
    height: 20px;
    margin: 20px -20px;
    background: ${background.app};
`
