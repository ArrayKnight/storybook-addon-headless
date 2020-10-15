import { styled } from '@storybook/theming'

export const Fieldset = styled.fieldset`
    padding: 0;
    border: 0;
    margin: 0 -15px 20px;

    & > label:last-child {
        margin-bottom: 0;
    }
`

export const Actions = styled.div`
    display: flex;
    justify-content: space-between;
`
