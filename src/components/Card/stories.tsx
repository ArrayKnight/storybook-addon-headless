import styled from '@emotion/styled'
import {
    Card as CardBase,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@material-ui/core'
import React from 'react'

const Card = styled(CardBase)`
    max-width: 240px;
`

export default {
    component: Card,
    title: 'Card',
    parameters: {
        headless: {
            restApi: {},
        },
    },
}

export const RestAPI = (...args) => {
    console.log(...args)

    return (
        <Card>
            <CardHeader />
            <CardMedia />
            <CardContent>
                <Typography />
            </CardContent>
            <CardActions />
        </Card>
    )
}

export const GraphQL = (...args) => {
    console.log(...args)

    return (
        <Card>
            <CardHeader />
            <CardMedia />
            <CardContent>
                <Typography />
            </CardContent>
            <CardActions />
        </Card>
    )
}
