import styled from '@emotion/styled'
import { background } from '@storybook/theming'

export const Root = styled.div`
    width: 100%;
    height: 100%;
    background: ${background.app};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
    padding: 10px 0;
`
