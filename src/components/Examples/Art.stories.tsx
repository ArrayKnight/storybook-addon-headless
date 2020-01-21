import { StoryContext } from '@storybook/addons'
import gql from 'graphql-tag'
import React from 'react'

import { headlessDecorator, pack } from '../../../dist'

import { Artwork } from '.'

export default {
    title: 'Examples/Art',
    component: Artwork,
    decorators: [
        headlessDecorator({
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
        },
    },
}

export const Artworks = ({ data }: StoryContext) => {
    if (data && data.Artworks) {
        return (
            <>
                {data.Artworks.artworks.map((artwork: any, index: number) => (
                    <Artwork key={index} {...artwork} />
                ))}
            </>
        )
    }

    return null
}
