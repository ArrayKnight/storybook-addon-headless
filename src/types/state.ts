import { ValidateFunction } from 'ajv'

import { Dictionary, Required, VariableType } from './generic'
import { HeadlessOptions } from './options'
import { Schema } from './schemas'

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
