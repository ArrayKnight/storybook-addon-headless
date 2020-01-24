import { StoryContext } from '@storybook/addons'
import { gql } from 'apollo-boost'
import React from 'react'

import { pack, withHeadless } from '../../dist'

import { Artwork as ArtworkCard } from './index'

export default {
    title: 'Examples/GraphQL',
    decorators: [
        withHeadless({
            graphql: {
                uri: 'https://metaphysics-production.artsy.net/',
            },
        }),
    ],
    parameters: {
        headless: {
            Artworks: {
                query: pack(gql`
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
                `),
                autoFetchOnInit: true,
            },
            Shows: {
                query: pack(gql`
                    query Shows($At_a_Fair: Boolean, $Featured: Boolean) {
                        partner_shows(
                            at_a_fair: $At_a_Fair
                            featured: $Featured
                        ) {
                            id
                            name
                            description
                            cover_image {
                                id
                                image_url
                            }
                        }
                    }
                `),
                variables: {
                    At_a_Fair: {
                        type: 'boolean',
                    },
                    Featured: {
                        type: 'boolean',
                    },
                },
            },
        },
    },
}

export const Artworks = ({ data }: StoryContext) => {
    if (data.Artworks) {
        return (
            <>
                {data.Artworks.artworks.map((artwork: any, index: number) => (
                    <ArtworkCard key={index} {...artwork} />
                ))}
            </>
        )
    }

    return null
}

export const Shows = ({ data }: StoryContext) => {
    console.log(data)

    return <></>
}
