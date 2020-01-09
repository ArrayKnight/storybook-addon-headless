import {
    Card as CardBase,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const Card = styled(CardBase)`
    max-width: 240px;
`

export default {
    component: Card,
    title: 'Card',
}

export const basic = () => (
    <Card>
        <CardHeader />
        <CardMedia />
        <CardContent>
            <Typography />
        </CardContent>
        <CardActions />
    </Card>
)
