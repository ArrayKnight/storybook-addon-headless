import { css, styled } from '@storybook/theming'

export const Root = styled.div(
    ({ theme }) => css`
        display: inline-flex;
        position: relative;
        font-size: ${theme.typography.size.s2 - 1}px;

        &[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `,
)

export const Container = styled.div(
    ({ theme }) => css`
        box-shadow: ${theme.input.border} 0 0 0 1px inset;
        border-radius: ${theme.input.borderRadius}px;
        display: flex;
        flex: 1 1 100%;

        input {
            width: 143px;
            min-height: 0;
            display: block;
            flex: 1 1 100%;
            background: none;

            &,
            &:focus {
                border: 0;
                box-shadow: none;
            }
        }

        &:focus,
        &:focus-within {
            box-shadow: ${theme.color.secondary} 0 0 0 1px inset;
        }

        ${theme.isOpen &&
        css`
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        `};

        ${theme.isValid &&
        css`
            boxshadow: ${theme.color.positive} 0 0 0 1px inset;
        `};

        ${theme.isError &&
        css`
            boxshadow: ${theme.color.negative} 0 0 0 1px inset;
        `};

        ${theme.isWarn &&
        css`
            boxshadow: ${theme.color.warning} 0 0 0 1px inset;
        `};
    `,
)

export const Chip = styled.div(
    ({ theme }) => css`
        border-radius: ${theme.input.borderRadius}px;
        margin: 2px;
        background: ${theme.background.app};
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        order: -1;

        span {
            max-width: 75px;
            padding: 0.21em 0.5em;
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    `,
)

export const Remove = styled.button(
    ({ theme }) => css`
        width: 24px;
        padding: 5px;
        border: 0;
        border-left: 1px solid ${theme.input.border};
        background: none;
        appearance: none;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 250ms;

        &:hover,
        &:focus {
            background: ${theme.background.warning};
            opacity: 1;
        }
    `,
)

export const Toggle = styled.button(
    ({ theme }) => css`
        width: 30px;
        height: 30px;
        padding: 5px;
        border: 0;
        border-left: 1px solid ${theme.input.border};
        background: none;
        flex: 0 0 auto;
        appearance: none;
        cursor: pointer;

        &:hover {
            background: ${theme.background.hoverable};
        }
    `,
)

export const Menu = styled.ul(
    ({ theme }) => css`
        padding: 0;
        border: 1px solid ${theme.input.border};
        border-top: 0;
        border-radius: ${theme.input.borderRadius}px;
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        margin: 0;
        list-style-type: none;
        display: ${theme.isOpen ? 'block' : 'none'};
        background: ${theme.background.content};
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        z-index: 1;

        &:empty {
            &:after {
                content: 'No items available';
                padding: 1em;
                display: block;
                font-style: italic;
                text-align: center;
            }
        }
    `,
)

export const MenuItem = styled.li(
    ({ theme }) => css`
        padding: 0.42em 1em;

        ${theme.isHighlighted &&
        css`
            background: ${theme.background.hoverable};
        `};

        ${theme.isSelected &&
        css`
            background: ${theme.background.positive};
        `};
    `,
)
