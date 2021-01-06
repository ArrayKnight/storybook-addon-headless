import React, { memo, ReactElement, ReactNode } from 'react'

import { isFunction } from '../../utilities'
import { ErrorBoundary } from '../ErrorBoundary'

interface Props {
    children?: () => ReactNode
    fallback?: ReactNode
}

export const BrowserOnly = memo(
    ({ children, fallback = null }: Props): ReactElement | null => {
        if (typeof window !== 'undefined' && isFunction(children)) {
            return <ErrorBoundary>{children()}</ErrorBoundary>
        }

        return <ErrorBoundary>{fallback}</ErrorBoundary>
    },
)

BrowserOnly.displayName = 'BrowserOnly'
