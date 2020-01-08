import { getConfig, setConfig } from '@storybook/addon-devkit'

export const ADDON_ID = 'headless'

setConfig({
    addonId: ADDON_ID,
    panelTitle: 'Headless',
})

export const config = getConfig()
