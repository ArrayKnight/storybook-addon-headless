import { StoryContext } from '@storybook/addons'
import React from 'react'

import { headlessDecorator } from '../../../dist'

import { User } from '.'

export default {
    title: 'Examples/User',
    component: User,
    decorators: [
        headlessDecorator({
            restful: {
                baseURL: 'https://jsonplaceholder.typicode.com/',
            },
        }),
    ],
    parameters: {
        headless: {
            Users: {
                query: 'users',
                autoFetchOnInit: true,
            },
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

export const Many = ({ data }: StoryContext) => {
    if (data && data.Users) {
        return (
            <>
                {data.Users.map((user: any) => (
                    <User key={user.id} {...user} />
                ))}
            </>
        )
    }

    return null
}

export const One = ({ data }: StoryContext) => {
    if (data && (data.User || data.Users)) {
        return <User {...(data.User || data.Users[0])} />
    }

    return null
}
