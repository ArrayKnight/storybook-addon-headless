import { Form, Icons } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import { useCombobox } from 'downshift'
import React, { memo, useState } from 'react'

import { Chip, Container, Menu, MenuItem, Remove, Root, Toggle } from './styled'

interface Item {
    label: string
    value: any
}

export type Props = {
    items: Item[]
} & (
    | {
          isMulti?: false
          onChange: (item: Item | null) => void
      }
    | {
          isMulti: true
          onChange: (items: Item[]) => void
      }
)

export const Select = memo((props: Props) => {
    const { items, isMulti } = props
    const [filteredItems, setFilteredItems] = useState(items)
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const {
        getComboboxProps,
        getInputProps,
        getItemProps,
        getLabelProps,
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

    function update(selected: Item[]): void {
        setSelectedItems(selected)

        switch (props.isMulti) {
            case true:
                return props.onChange(selected)

            case false:
            case undefined:
                const [item] = selected

                return props.onChange(item || null)
        }
    }

    function remove(item: Item): () => void {
        return () => {
            update(selectedItems.filter(({ value }) => value !== item.value))
        }
    }

    return (
        <ThemeProvider theme={{ isOpen }}>
            <Root {...getLabelProps()} {...getComboboxProps()}>
                <Container>
                    {selectedItems.map((item, index) => (
                        <Chip key={`${index}-${item.label}-chip`}>
                            <span>{item.label}</span>
                            <Remove onClick={remove(item)}>
                                <Icons icon="close" />
                            </Remove>
                        </Chip>
                    ))}
                    <Form.Input {...getInputProps()} />
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
