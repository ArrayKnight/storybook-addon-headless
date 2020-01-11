import { addons, types } from '@storybook/addons'
import { AddonPanel } from '@storybook/components'
import React from 'react'

import { Panel } from './components'
import { ADDON_ID, PANEL_ID, PANEL_TITLE, PARAM_KEY } from './config'

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: PANEL_TITLE,
        render: ({ active, key }) => (
            <AddonPanel active={active} key={key}>
                <Panel />
            </AddonPanel>
        ),
        paramKey: PARAM_KEY,
    })
})
