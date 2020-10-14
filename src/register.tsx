import { addons, RenderOptions, types } from '@storybook/addons'
import React, { ReactElement, useEffect, useState } from 'react'

import { Panel } from './components'
import {
    ADDON_ID,
    PANEL_ID,
    PANEL_TITLE,
    PARAM_KEY,
    STORAGE_KEY,
} from './config'

export function Render(props: RenderOptions): ReactElement {
    const [firstRender, setFirstRender] = useState(true)

    if (firstRender) {
        sessionStorage.removeItem(STORAGE_KEY)
    }

    useEffect(() => {
        setFirstRender(false)
    }, [])

    return <Panel {...props} />
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
