import styled from '@emotion/styled'
import {
    Card as CardBase,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@material-ui/core'
import gql from 'graphql-tag'
import React from 'react'
import { number, string } from 'yup'

const Card = styled(CardBase)`
    max-width: 240px;
`

export default {
    component: Card,
    title: 'Card',
    parameters: {
        headless: {
            Artworks: gql`
                {
                    artworks {
                        artist {
                            name
                            location
                        }
                        imageUrl
                        title
                    }
                }
            `,
            Country: {
                query: gql`
                    query Country($code: String) {
                        country(code: $code) {
                            name
                        }
                    }
                `,
                variables: {
                    code: string()
                        .required()
                        .min(2)
                        .max(2),
                },
            },
            Users: 'users',
            User: {
                query: 'users/{id}',
                variables: {
                    id: number()
                        .required()
                        .integer()
                        .min(1),
                },
            },
        },
    },
}

export const RestAPI = (...args: any[]) => {
    // console.log(...args)

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

export const GraphQL = (...args: any[]) => {
    // console.log(...args)

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
