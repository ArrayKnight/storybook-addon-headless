import { Theme, useTheme } from '@storybook/theming'
import React, { memo, useMemo } from 'react'
import Json, { InteractionProps } from 'react-json-view'

import type {
    ApiParameters,
    HeadlessParameter,
    HeadlessState,
    ObjectLike,
} from '../../types'
import {
    getGraphQLUri,
    getRestfulUrl,
    isDocumentNode,
    isGraphQLParameters,
    isString,
} from '../../utilities'
import { Message } from '../Message'
import { Variables } from '../Variables'
import { Separator, TabContent } from './styled'

interface Props {
    name: string
    data: unknown
    error?: Record<string, unknown>
    options: HeadlessState['options']
    parameter: HeadlessParameter
    onFetch: (
        name: string,
        apiParameters: ApiParameters,
        variables: Record<string, unknown>,
    ) => Promise<unknown>
    onUpdate: (name: string, props: InteractionProps) => void
}

export const Tab = memo(
    ({
        name,
        data,
        error,
        options: { graphql, restful, jsonDark, jsonLight },
        parameter,
        onFetch,
        onUpdate,
    }: Props) => {
        const theme = useTheme<Theme>()
        const parameters = useMemo(
            () =>
                isString(parameter) || isDocumentNode(parameter)
                    ? ({ query: parameter } as ApiParameters)
                    : parameter,
            [parameter],
        )
        const hasData = !!data
        const hasError = !!error

        async function fetch(
            variables: Record<string, unknown>,
        ): Promise<void> {
            await onFetch(name, parameters, variables)
        }

        function update(props: InteractionProps): void {
            onUpdate(name, props)
        }

        return (
            <TabContent>
                <Message collapsible={isGraphQLParameters(parameters)}>
                    {isGraphQLParameters(parameters)
                        ? getGraphQLUri(graphql, parameters)
                        : getRestfulUrl(restful, parameters, {})}
                </Message>
                <Variables
                    hasData={hasData}
                    hasError={hasError}
                    parameters={parameters}
                    onFetch={fetch}
                />
                {(hasData || hasError) && (
                    <>
                        <Separator />
                        <Json
                            src={(data as ObjectLike) ?? error}
                            name={null}
                            iconStyle="square"
                            theme={
                                theme.base === 'light' ? jsonLight : jsonDark
                            }
                            collapsed={hasError ? 1 : false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            enableClipboard={hasData}
                            onAdd={update}
                            onDelete={update}
                            onEdit={update}
                        />
                    </>
                )}
            </TabContent>
        )
    },
)

Tab.displayName = 'Tab'
