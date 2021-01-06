import { gql } from '@apollo/client'
import { Args } from '@storybook/addons'
import React, { ReactElement } from 'react'

import {
    FetchStatus,
    HeadlessStoryContext,
    Loader,
    pack,
    Prompt,
    withHeadless,
} from '../../dist'

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

export const Artworks = (
    args: Args,
    {
        status,
        data,
    }: HeadlessStoryContext<{ Artworks?: { artworks?: ArtworkProps[] } }>,
): ReactElement | null => {
    switch (status?.Artworks) {
        case FetchStatus.Inactive:
        case FetchStatus.Rejected:
            return <Prompt />

        case FetchStatus.Loading:
            return <Loader />

        default:
            return Array.isArray(data?.Artworks?.artworks) ? (
                <>
                    {data.Artworks.artworks.map((artwork, index) => (
                        <ArtworkCard key={index} {...artwork} />
                    ))}
                </>
            ) : null
    }
}

export const Shows = (
    args: Args,
    {
        status,
        data,
    }: HeadlessStoryContext<{
        Shows?: {
            partner_shows?: ShowProps[]
        }
    }>,
): ReactElement | null => {
    switch (status?.Shows) {
        case FetchStatus.Inactive:
        case FetchStatus.Rejected:
            return <Prompt />

        case FetchStatus.Loading:
            return <Loader />

        default:
            return Array.isArray(data?.Shows?.partner_shows) ? (
                <>
                    {data.Shows.partner_shows.map((show, index) => (
                        <ShowCard key={index} {...show} />
                    ))}
                </>
            ) : null
    }
}
