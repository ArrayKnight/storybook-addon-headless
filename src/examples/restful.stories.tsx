import { Args, StoryContext } from '@storybook/addons'
import React, { ReactElement } from 'react'

import { withHeadless } from '../../dist'

import { User as UserCard, UserProps } from '.'

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

export const Users = (
    args: Args,
    { data }: StoryContext,
): ReactElement | null => {
    const payload = data as { Users?: UserProps[] } | undefined

    if (Array.isArray(payload?.Users)) {
        return (
            <>
                {payload.Users.map((user: UserProps) => (
                    <UserCard key={user.id} {...user} />
                ))}
            </>
        )
    }

    return null
}

export const User = (
    args: Args,
    { data }: StoryContext,
): ReactElement | null => {
    const payload = data as
        | { Users?: UserProps[]; User?: UserProps }
        | undefined

    if (
        payload?.User ||
        (Array.isArray(payload?.Users) && payload?.Users?.length)
    ) {
        return <UserCard {...(payload.User || payload.Users[0])} />
    }

    return null
}
