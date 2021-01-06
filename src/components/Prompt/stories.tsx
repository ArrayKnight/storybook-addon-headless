import { text, withKnobs } from '@storybook/addon-knobs'
import React, { ReactElement } from 'react'

import { Prompt } from '.'

export default {
    title: 'Prompt',
    decorators: [withKnobs],
}

export const PromptStory = (): ReactElement => {
    const headline = text('headline', '')
    const message = text('message', '')

    return (
        <Prompt
            headline={headline || undefined}
            message={message || undefined}
        />
    )
}

PromptStory.storyName = 'Prompt'
