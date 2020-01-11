import {
    useAddonState,
    useChannel,
    useParameter,
    useStorybookApi,
} from '@storybook/api'
import DefaultClient from 'apollo-boost'
import gql from 'graphql-tag'
import React, { memo } from 'react'

import { ADDON_ID, PARAM_KEY } from '../../config'
import { Root } from './styled'

export const Panel = memo(() => {
    const api = useStorybookApi()
    const [state] = useAddonState(ADDON_ID)
    const parameter = useParameter(PARAM_KEY)
    const emit = useChannel({
        restApi: (instance) => {
            console.log({ instance })
        },
        graphQL: (instance: DefaultClient<any>) => {
            console.log({ instance })

            console.log(
                instance.query({
                    query: gql`
                        {
                            countries {
                                name
                            }
                        }
                    `,
                }),
            )
        },
    })

    console.log({ api, emit, state, parameter })

    return <Root>Panel</Root>
})
