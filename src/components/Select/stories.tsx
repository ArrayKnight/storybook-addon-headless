import { action } from '@storybook/addon-actions'
import { array, boolean, withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import { Select } from '.'

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

    return (
        <Select
            items={items.map((label) => ({
                label,
                value: label.toLowerCase(),
            }))}
            isMulti={boolean('isMulti', false) as never}
            onChange={action('onChange')}
        />
    )
}

SelectStory.story = {
    name: 'Component',
}
