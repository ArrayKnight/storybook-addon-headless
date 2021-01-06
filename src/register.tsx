import { addons, RenderOptions, types } from '@storybook/addons'
import React, { ReactElement } from 'react'

import { ErrorBoundary, Panel } from './components'
import {
    ADDON_ID,
    PANEL_ID,
    PANEL_TITLE,
    PARAM_KEY,
    STORAGE_KEY,
} from './config'
import { useImmediateEffect } from './utilities'

export function Render(props: RenderOptions): ReactElement {
    useImmediateEffect(() => sessionStorage.removeItem(STORAGE_KEY))

    return (
        <ErrorBoundary>
            <Panel {...props} />
        </ErrorBoundary>
    )
}

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.TAB,
        title: PANEL_TITLE,
        paramKey: PARAM_KEY,
        route: ({ storyId }) => `/${ADDON_ID}/${storyId}`,
        match: ({ viewMode }) => viewMode === ADDON_ID,
        render: Render,
    })
})
