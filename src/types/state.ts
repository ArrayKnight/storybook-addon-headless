import type { StoryContext } from '@storybook/addons'
import type { ValidateFunction } from 'ajv'

import type { HeadlessOptions } from './options'
import type { Schema } from './schemas'

export enum FetchStatus {
    Inactive,
    Loading,
    Rejected,
    Resolved,
}

export enum VariableType {
    Unknown,
    Boolean,
    Date,
    Number,
    Select,
    String,
}

export interface HeadlessState {
    storyId: string
    options: Required<HeadlessOptions>
    status: Record<string, FetchStatus>
    data: Record<string, unknown>
    errors: Record<string, Record<string, unknown>>
}

export interface VariableState {
    schema: Schema
    type: VariableType
    validator: ValidateFunction
    dirty: boolean
    error: string | null
    value: unknown
}

export type HeadlessStoryContext = StoryContext &
    Pick<HeadlessState, 'status' | 'data' | 'errors'>
