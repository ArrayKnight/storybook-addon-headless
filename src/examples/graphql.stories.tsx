import { gql } from '@apollo/client'
import { StoryContext } from '@storybook/addons'
import React, { ReactElement } from 'react'

import { pack, withHeadless } from '../../dist'

import {
    Artwork as ArtworkCard,
    ArtworkProps,
    Show as ShowCard,
    ShowProps,
} from '.'

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
                    query Shows(
                        $At_a_Fair: Boolean
                        $Featured: Boolean
                        $Size: Int
                    ) {
                        partner_shows(
                            at_a_fair: $At_a_Fair
                            featured: $Featured
                            size: $Size
                        ) {
                            id
                            name
                            description
                            cover_image {
                                id
                                image_versions
                                image_url
                            }
                        }
                    }
                `),
                variables: {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    At_a_Fair: {
                        type: 'boolean',
                    },
                    Featured: {
                        type: 'boolean',
                    },
                    Size: {
                        type: 'integer',
                        minimum: 1,
                    },
                },
                defaults: {
                    Size: 10,
                },
            },
        },
    },
}

export const Artworks = ({ data }: StoryContext): ReactElement | null => {
    if (data.Artworks && Array.isArray(data.Artworks.artworks)) {
        return (
            <>
                {data.Artworks.artworks.map(
                    (artwork: ArtworkProps, index: number) => (
                        <ArtworkCard key={index} {...artwork} />
                    ),
                )}
            </>
        )
    }

    return null
}

export const Shows = ({ data }: StoryContext): ReactElement | null => {
    if (data.Shows && Array.isArray(data.Shows.partner_shows)) {
        return (
            <>
                {data.Shows.partner_shows.map(
                    (show: ShowProps, index: number) => (
                        <ShowCard key={index} {...show} />
                    ),
                )}
            </>
        )
    }

    return <></>
}
