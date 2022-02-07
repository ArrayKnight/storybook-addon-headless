import { Icons } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import React, {
    memo,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react'

import { Button, Pre, Root } from './styled'

export interface Props {
    children: ReactNode
    collapsible?: boolean
    collapsed?: boolean
}

export const TEST_IDS = Object.freeze({
    root: 'MessageRoot',
    content: 'MessageContent',
    toggle: 'MessageToggle',
    icon: 'MessageIcon',
})

export const Message = memo(
    ({
        children,
        collapsible = false,
        collapsed = true,
    }: Props): ReactElement | null => {
        const [isCollapsed, setIsCollapsed] = useState(collapsed)
        const toggle = useCallback(
            () => setIsCollapsed(!isCollapsed),
            [isCollapsed],
        )

        useEffect(() => {
            if (collapsed !== isCollapsed) {
                setIsCollapsed(collapsed)
            }
        }, [collapsed]) // eslint-disable-line react-hooks/exhaustive-deps

        if (children) {
            return (
                <ThemeProvider
                    theme={{
                        collapsible,
                        isCollapsed: collapsible && isCollapsed,
                    }}
                >
                    <Root onClick={toggle} data-testid={TEST_IDS.root}>
                        <Pre data-testid={TEST_IDS.content}>{children}</Pre>
                        {collapsible && (
                            <Button
                                data-testid={TEST_IDS.toggle}
                                aria-expanded={!isCollapsed}
                            >
                                <Icons
                                    icon={
                                        isCollapsed ? 'arrowleft' : 'arrowdown'
                                    }
                                    data-testid={TEST_IDS.icon}
                                />
                            </Button>
                        )}
                    </Root>
                </ThemeProvider>
            )
        }

        return null
    },
)

Message.displayName = 'Message'
