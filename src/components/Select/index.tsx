import { useCombobox } from 'downshift'
import React, { memo, useState } from 'react'

export interface Props {
    items: any[]
}

export const Select = memo(({ items }: Props) => {
    const [inputItems, setInputItems] = useState(items)
    const {
        isOpen,
        // selectedItem,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items: inputItems,
        onInputValueChange: ({ inputValue }) => {
            setInputItems(
                items.filter((item) =>
                    item.toLowerCase().startsWith(inputValue.toLowerCase()),
                ),
            )
        },
    })
    return (
        <>
            <label {...getLabelProps()}>Choose an element:</label>
            <div {...getComboboxProps()}>
                <input {...getInputProps()} />
                <button {...getToggleButtonProps()} aria-label="toggle menu">
                    &#8595;
                </button>
            </div>
            <ul {...getMenuProps()}>
                {isOpen &&
                    inputItems.map((item, index) => (
                        <li
                            style={
                                highlightedIndex === index
                                    ? { backgroundColor: '#bde4ff' }
                                    : {}
                            }
                            key={`${item}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            {item}
                        </li>
                    ))}
            </ul>
        </>
    )
})
