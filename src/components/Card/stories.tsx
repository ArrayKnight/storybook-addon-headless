import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@material-ui/core'
import React from 'react'

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
