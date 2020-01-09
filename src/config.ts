import { getConfig, setConfig } from '@storybook/addon-devkit'

export const ADDON_ID = 'headless'

setConfig({
    addonId: ADDON_ID,
    panelTitle: 'Headless',
    paramKey: ADDON_ID,
})

export const config = getConfig()
