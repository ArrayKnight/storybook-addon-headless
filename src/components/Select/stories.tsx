import { array, withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import { Select } from '.'

export default {
    title: 'Select',
    component: Select,
    decorators: [withKnobs],
}

export const SelectStory = () => {
    const items = array('items', [])

    return <Select items={items} />
}

SelectStory.story = {
    name: '',
}
