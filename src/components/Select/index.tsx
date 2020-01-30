import { Form, Icons } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import { useCombobox } from 'downshift'
import React, { memo, useState } from 'react'

import { Item } from '../../types'
import { Chip, Container, Menu, MenuItem, Remove, Root, Toggle } from './styled'
import { isArray, isUndefined } from '../../utilities'

export type Props = {
    items: Item[]
    valid?: 'valid' | 'error' | 'warn'
} & (
    | {
          selected: Item | undefined
          isMulti?: false
          onChange: (item: Item | null) => void
      }
    | {
          selected: Item[] | undefined
          isMulti: true
          onChange: (items: Item[]) => void
      }
)

export const Select = memo((props: Props) => {
    const { items, selected, isMulti, valid } = props
    const selectedItems = isUndefined(selected)
        ? []
        : isArray(selected)
        ? selected
        : [selected]
    const [filteredItems, setFilteredItems] = useState(items)
    const {
        getComboboxProps,
        getInputProps,
        getItemProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        isOpen,
        reset,
    } = useCombobox({
        items: filteredItems,
        onInputValueChange: ({ inputValue }) => {
            setFilteredItems(
                items.filter(({ label }) =>
                    label.toLowerCase().includes(inputValue.toLowerCase()),
                ),
            )
        },
        onSelectedItemChange: ({ selectedItem }) => {
            console.log('onSelectedItemChange', { selectedItem })

            if (selectedItem) {
                update(
                    isMulti
                        ? Array.from(new Set([...selectedItems, selectedItem]))
                        : [selectedItem],
                )
            }
        },
        onIsOpenChange: (state) => {
            if (!state.isOpen) {
                reset()
            }
        },
    })

    function update(updated: Item[]): void {
        switch (props.isMulti) {
            case true:
                return props.onChange(updated)

            case false:
            case undefined:
                const [item] = updated

                return props.onChange(item || null)
        }
    }

    function remove(item: Item): () => void {
        return () => {
            update(selectedItems.filter(({ value }) => value !== item.value))
        }
    }

    return (
        <ThemeProvider
            theme={{
                isOpen,
                isError: valid === 'error',
                isWarn: valid === 'warn',
                isValid: isUndefined(valid) || valid === 'valid',
            }}
        >
            <Root {...getComboboxProps()}>
                <Container>
                    <Form.Input {...getInputProps()} />
                    {selectedItems.map((item, index) => (
                        <Chip key={`${index}-${item.label}-chip`}>
                            <span>{item.label}</span>
                            <Remove onClick={remove(item)}>
                                <Icons icon="close" />
                            </Remove>
                        </Chip>
                    ))}
                    <Toggle
                        {...getToggleButtonProps()}
                        aria-label="toggle menu"
                    >
                        <Icons icon={isOpen ? 'arrowleft' : 'arrowdown'} />
                    </Toggle>
                </Container>
                <Menu {...getMenuProps()}>
                    {filteredItems.map((item, index) => (
                        <ThemeProvider
                            key={`${index}-${item.label}-item`}
                            theme={{
                                isHighlighted: highlightedIndex === index,
                                isSelected: !!selectedItems.find(
                                    ({ value }) => value === item.value,
                                ),
                            }}
                        >
                            <MenuItem {...getItemProps({ item, index })}>
                                {item.label}
                            </MenuItem>
                        </ThemeProvider>
                    ))}
                </Menu>
            </Root>
        </ThemeProvider>
    )
})
