import { Form, Icons } from '@storybook/components'
import { InputStyleProps } from '@storybook/components/dist/ts3.9/form/input/input'
import { ThemeProvider } from '@storybook/theming'
import { useCombobox } from 'downshift'
import React, { memo, useState } from 'react'

import type { Item } from '../../types'
import { isArray, isUndefined } from '../../utilities'
import { Chip, Container, Menu, MenuItem, Remove, Root, Toggle } from './styled'

export type Props = { items: Item[] } & Pick<InputStyleProps, 'valid'> &
    (
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

export const TEST_IDS = Object.freeze({
    root: 'SelectRoot',
    input: 'SelectInput',
    chip: 'SelectChip',
    remove: 'SelectRemove',
    toggle: 'SelectToggle',
    menu: 'SelectMenu',
    item: 'SelectItem',
})

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
                return props.onChange(updated[0] || null)
        }
    }

    function remove(item: Item): () => void {
        return () =>
            update(selectedItems.filter(({ value }) => value !== item.value))
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
            <Root {...getComboboxProps()} data-testid={TEST_IDS.root}>
                <Container>
                    <Form.Input
                        {...getInputProps()}
                        data-testid={TEST_IDS.input}
                    />
                    {selectedItems.map((item, index) => (
                        <Chip
                            key={`${index}-${item.label}-chip`}
                            data-testid={TEST_IDS.chip}
                        >
                            <span>{item.label}</span>
                            <Remove
                                onClick={remove(item)}
                                data-testid={TEST_IDS.remove}
                            >
                                <Icons icon="close" />
                            </Remove>
                        </Chip>
                    ))}
                    <Toggle
                        {...getToggleButtonProps()}
                        aria-label="toggle menu"
                        data-testid={TEST_IDS.toggle}
                    >
                        <Icons icon={isOpen ? 'arrowleft' : 'arrowdown'} />
                    </Toggle>
                </Container>
                <Menu {...getMenuProps()} data-testid={TEST_IDS.menu}>
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
                            <MenuItem
                                {...getItemProps({ item, index })}
                                data-testid={TEST_IDS.item}
                            >
                                {item.label}
                            </MenuItem>
                        </ThemeProvider>
                    ))}
                </Menu>
            </Root>
        </ThemeProvider>
    )
})

Select.displayName = 'Select'
