declare module '@storybook/addon-devkit' {
    import { ElementType, FunctionComponent, ReactNode } from 'react'
    import { types as addonTypes } from '@storybook/addons'
    import { API } from '@storybook/api'

    interface Dictionary<T = any> {
        [key: string]: T
    }

    export interface ConfigOptions {
        addonId?: string
        panelId?: string
        panelTitle?: string
        paramKey?: string
        eventInit?: string
        eventData?: string
        eventBack?: string
    }

    export function setConfig(config: ConfigOptions): void

    export interface ConfigValues {
        ADDON_ID: string
        PANEL_ID: string
        PANEL_Title: string
        PARAM_Key: string
        EVENT_ID_INIT: string
        EVENT_ID_DATA: string
        EVENT_ID_BACK: string
    }

    export function getConfig(): ConfigValues

    class ChannelStore {
        // TODO determine what should be public
    }

    export interface Selector {
        (store: ChannelStore): any
    }

    export type Selectors = Dictionary<Selector>

    export interface Reducer {
        (current: Dictionary, payload: any): Dictionary
    }

    export type Reducers = Dictionary<Reducer>

    export interface Action {
        (payload: any): Promise<void>
    }

    export interface ActionCreator {
        (reducer: Reducer): Action
    }

    export interface ActionCreators {
        global: ActionCreator
        local: ActionCreator
    }

    export interface CreateActions {
        (creators: ActionCreators): Dictionary
    }

    export interface RegisterOptions {
        type?: addonTypes
        initData?: Dictionary
    }

    export function register(
        storeSelectors?: Selectors,
        createActions?: CreateActions | Reducers,
    ): (Component: ElementType, options?: RegisterOptions) => void

    export interface DecoratorOptions {
        isGlobal?: boolean
    }

    export function createDecorator(
        storeSelectors?: Selectors,
        createActions?: CreateActions | Reducers,
        paramSelectors?: Dictionary<
            (parameters: Dictionary, selectors: Dictionary<() => any>) => any
        >,
    ): (
        Component: ElementType,
        options?: DecoratorOptions,
    ) => (
        initData: Dictionary,
    ) => (getStory: () => any, context: any) => ElementType

    export function setParameters(): (parameters: Dictionary) => Dictionary

    export interface LayoutProviderProps {
        children: ReactNode
    }

    export const LayoutProvider: FunctionComponent<LayoutProviderProps>

    export interface Rect {
        width?: number
        height?: number
        isLandscape?: boolean
    }

    export interface PanelProps {
        // TODO ...actions
        // TODO ...selectors
        api: API
        active: boolean
        store: Dictionary
        setData: () => void
        kind?: string
        story?: string // TODO verify type
        ADDON_ID: string
        PANEL_ID: string
        PANEL_Title: string
        rect: Rect
        Layout: Layout
        Block: Block
        isFirstDataReceived: boolean
    }

    export interface LayoutProps {
        children: ReactNode
        className?: string
    }

    export const Layout: FunctionComponent<LayoutProps>

    export interface BlockProps {
        children: ReactNode
        className?: string
        size?: number
    }

    export const Block: FunctionComponent<BlockProps>
}
