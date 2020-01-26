import { ValidateFunction } from 'ajv'

import { Dictionary, Required, Schema, VariableType } from './generic'
import { HeadlessOptions } from './options'

export interface HeadlessState {
    storyId: string
    options: Required<HeadlessOptions>
    data: Dictionary
    errors: Dictionary
}

export interface VariableState {
    schema: Schema
    type: VariableType
    validator: ValidateFunction
    dirty: boolean
    error: string | null
    value: any
}
