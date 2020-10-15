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
    switch (status?.Users) {
        case FetchStatus.Inactive:
        case FetchStatus.Rejected:
            return <Prompt />

        case FetchStatus.Loading:
            return <Loader />

        default:
            return Array.isArray(data?.Users) ? (
                <>
                    {data.Users.map((user) => (
                        <UserCard key={user.id} {...user} />
                    ))}
                </>
            ) : null
    }
}

export const User = (
    args: Args,
    {
        status,
        data,
    }: HeadlessStoryContext<{ Users?: UserProps[]; User?: UserProps }>,
): ReactElement | null => {
    switch (status?.User) {
        case FetchStatus.Inactive:
        case FetchStatus.Rejected:
            return <Prompt />

        case FetchStatus.Loading:
            return <Loader />

        default:
            return data?.User ? <UserCard {...data.User} /> : null
    }
}
