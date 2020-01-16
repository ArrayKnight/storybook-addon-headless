import { Form } from '@storybook/components'
import React from 'react'

import { ApiParameters, HeadlessParameter } from '../../types'
import { isQuery, isString } from '../../utilities'
import { Variable } from '../Variable'
import { Fieldset } from './styled'

const { Button } = Form

interface Props {
    parameter: HeadlessParameter
}

export const Variables = ({ parameter }: Props) => {
    const config: ApiParameters =
        isString(parameter) || isQuery(parameter)
            ? ({ query: parameter, variables: {} } as ApiParameters)
            : parameter
    const variables = Object.entries(config.variables)

    return (
        <>
            <Fieldset>
                {variables.map(([name, schema]) => (
                    <Variable key={name} name={name} schema={schema} />
                ))}
            </Fieldset>
            <Button disabled={true}>Fetch</Button>
        </>
    )
}
