import { Icons } from '@storybook/components'
import { ThemeProvider } from '@storybook/theming'
import React, { memo, useState } from 'react'

import { Button, Pre, Root } from './styled'

interface Props {
    children: string
    collapisble?: boolean
    collapsed?: boolean
}

export const Message = memo(
    ({ children, collapisble = false, collapsed = true }: Props) => {
        const [isCollapsed, setIsCollapsed] = useState(collapsed)

        function toggle(): void {
            setIsCollapsed(!isCollapsed)
        }

        return (
            <>
                {!!children && (
                    <ThemeProvider
                        theme={{ isCollapsed: collapisble && isCollapsed }}
                    >
                        <Root onClick={toggle}>
                            <Pre>{children}</Pre>
                            {collapisble && (
                                <Button>
                                    <Icons
                                        icon={
                                            isCollapsed
                                                ? 'arrowleft'
                                                : 'arrowdown'
                                        }
                                    />
                                </Button>
                            )}
                        </Root>
                    </ThemeProvider>
                )}
            </>
        )
    },
)
