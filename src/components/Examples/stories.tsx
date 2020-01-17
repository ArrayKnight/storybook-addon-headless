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

const Card = styled(CardBase)`
    max-width: 240px;
`

export default {
    component: Card,
    title: 'Examples',
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
                    code: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 2,
                    },
                },
            },
            Users: 'users',
            User: {
                query: 'users/{id}',
                variables: {
                    id: {
                        type: 'integer',
                        minimum: 1,
                    },
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
