import { styled } from '@storybook/theming'

export const Row = styled.div`
    min-height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const Error = styled.span`
    padding-left: 10px;

    &:first-letter {
        text-transform: uppercase;
    }
`
