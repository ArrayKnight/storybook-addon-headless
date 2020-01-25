import { ValidateFunction } from 'ajv'

import { Dictionary, Required, VariableType } from './generic'
import { HeadlessOptions } from './options'

export interface HeadlessState {
    storyId: string
    options: Required<HeadlessOptions>
    data: Dictionary
    errors: Dictionary
}

export interface VariableState {
    type: VariableType
    validator: ValidateFunction
    dirty: boolean
    error: string | null
    value: any
}
