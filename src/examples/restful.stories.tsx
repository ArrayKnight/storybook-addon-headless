import { StoryContext } from '@storybook/addons'
import React, { ReactNode } from 'react'

import { withHeadless } from '../../dist'

import { User as UserCard } from '.'

export default {
    title: 'Examples/Restful',
    decorators: [
        withHeadless({
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

export const Users = ({ data }: StoryContext): ReactNode => {
    if (data.Users) {
        return (
            <>
                {data.Users.map((user: unknown) => (
                    <UserCard key={user.id} {...user} />
                ))}
            </>
        )
    }

    return null
}

export const User = ({ data }: StoryContext): ReactNode => {
    if (data.User || data.Users) {
        return <UserCard {...(data.User || data.Users[0])} />
    }

    return null
}
