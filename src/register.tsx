import { addons, RenderOptions, types } from '@storybook/addons'
import React, { ReactElement } from 'react'

import { Panel } from './components'
import { ADDON_ID, PANEL_ID, PANEL_TITLE, PARAM_KEY } from './config'

export function render(props: RenderOptions): ReactElement {
    return <Panel {...props} />
}

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.TAB,
        title: PANEL_TITLE,
        paramKey: PARAM_KEY,
        route: ({ storyId }) => `/${ADDON_ID}/${storyId}`,
        match: ({ viewMode }) => viewMode === ADDON_ID,
        render,
    })
})
