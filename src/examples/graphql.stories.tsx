import { gql } from '@apollo/client'
import { Args, StoryContext } from '@storybook/addons'
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

interface Artworks {
    artworks?: ArtworkProps[]
}

export const Artworks = (
    args: Args,
    { data }: StoryContext,
): ReactElement | null => {
    const payload = data as { Artworks?: Artworks } | undefined

    if (payload?.Artworks && Array.isArray(payload?.Artworks?.artworks)) {
        return (
            <>
                {payload?.Artworks?.artworks.map(
                    (artwork: ArtworkProps, index: number) => (
                        <ArtworkCard key={index} {...artwork} />
                    ),
                )}
            </>
        )
    }

    return null
}

interface Shows {
    partner_shows?: ShowProps[]
}

export const Shows = (
    args: Args,
    { data }: StoryContext,
): ReactElement | null => {
    const payload = data as { Shows?: Shows } | undefined

    if (payload?.Shows && Array.isArray(payload?.Shows?.partner_shows)) {
        return (
            <>
                {payload?.Shows?.partner_shows.map(
                    (show: ShowProps, index: number) => (
                        <ShowCard key={index} {...show} />
                    ),
                )}
            </>
        )
    }

    return null
}
