import React, { memo, ReactNode } from 'react'

import { Root } from './styled'

interface Props {
    children: ReactNode
}

export const Message = memo(({ children }: Props) => {
    return <>{!!children && <Root>{children}</Root>}</>
})
