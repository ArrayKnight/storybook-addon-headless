import React, { ReactNode } from 'react'

import { Root } from './styled'

interface Props {
    children: ReactNode
}

export const Message = ({ children }: Props) => {
    return <>{!!children && <Root>{children}</Root>}</>
}
