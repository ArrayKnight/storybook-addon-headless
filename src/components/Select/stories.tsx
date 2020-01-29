import { action } from '@storybook/addon-actions'
import { array, boolean, withKnobs } from '@storybook/addon-knobs'
import React, { useState } from 'react'

import { Select } from '.'
import { convertToItem, isArray, isNull } from '../../utilities'
import { Item } from '../../types'

export default {
    title: 'Select',
    component: Select,
    decorators: [withKnobs],
}

export const SelectStory = () => {
    const items = array('items', [
        'Foo',
        'Bar',
        'Baz',
        'Wux',
        'Lorem Ipsum Dolor',
    ])
    const [value, setValue] = useState<any[]>([])
    const isMulti = boolean('isMulti', false)

    function onChange(val: Item | Item[] | null): void {
        action('onChange')(val)

        if (isNull(val)) {
            setValue([])
        } else {
            setValue(isArray(val) ? val.map((item) => item.value) : [val.value])
        }
    }

    return (
        <Select
            items={items.map(convertToItem)}
            selected={
                (isMulti
                    ? value.map(convertToItem)
                    : value.length === 0
                    ? undefined
                    : convertToItem(value[0])) as never
            }
            isMulti={isMulti as never}
            onChange={onChange}
        />
    )
}

SelectStory.story = {
    name: 'Component',
}
