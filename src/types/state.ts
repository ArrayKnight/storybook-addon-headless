import { ValidateFunction } from 'ajv'

import { VariableType } from './generic'
import { HeadlessOptions } from './options'
import { Schema } from './schemas'

export interface HeadlessState {
    storyId: string
    options: Required<HeadlessOptions>
    data: Record<string, unknown>
    errors: Record<string, unknown>
}

export interface VariableState {
    schema: Schema
    type: VariableType
    validator: ValidateFunction
    dirty: boolean
    error: string | null
    value: unknown
}
