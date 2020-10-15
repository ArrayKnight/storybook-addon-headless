import { Args } from '@storybook/addons'
import React, { ReactElement } from 'react'

import {
    FetchStatus,
    HeadlessStoryContext,
    Loader,
    Prompt,
    withHeadless,
} from '../../dist'

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
    { status, data }: HeadlessStoryContext<{ Users?: UserProps[] }>,
): ReactElement | null => {
    if (status?.Users === FetchStatus.Loading) {
        return <Loader />
    }

    if (Array.isArray(data?.Users)) {
        return (
            <>
                {data.Users.map((user) => (
                    <UserCard key={user.id} {...user} />
                ))}
            </>
        )
    }

    return null
}

export const User = (
    args: Args,
    {
        status,
        data,
    }: HeadlessStoryContext<{ Users?: UserProps[]; User?: UserProps }>,
): ReactElement | null => {
    if (status?.User === FetchStatus.Inactive) {
        return <Prompt />
    }

    if (status?.User === FetchStatus.Loading) {
        return <Loader />
    }

    if (data?.User) {
        return <UserCard {...data.User} />
    }

    return null
}
