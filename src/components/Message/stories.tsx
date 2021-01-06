import React, { ReactElement } from 'react'
import { boolean, text, withKnobs } from '@storybook/addon-knobs'

import { Message } from '.'

export default {
    title: 'Message',
    decorators: [withKnobs],
}

export const MessageStory = (): ReactElement => {
    const children = text(
        'children',
        `Hello World

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel tortor ac elit tincidunt consequat a vel metus. Nunc mollis ligula odio, at consectetur nulla interdum ut. Fusce sed lacus ut dolor pellentesque tincidunt. Suspendisse sit amet quam vel mi dapibus sodales ac ac enim. Nulla mattis erat eu lorem sodales eleifend. Praesent ac cursus nulla, eu cursus ante. Phasellus malesuada egestas enim, eget mollis urna rhoncus vel. Mauris laoreet lorem enim, et iaculis purus tempus quis. Etiam eu lacus ut odio aliquam tempor. Praesent at tortor sem. Nunc eget efficitur magna.`,
    )
    const collapsible = boolean('collapsible', false)
    const collapsed = boolean('collapsed', true)

    return (
        <Message collapsible={collapsible} collapsed={collapsed}>
            {children}
        </Message>
    )
}

MessageStory.storyName = 'Message'
