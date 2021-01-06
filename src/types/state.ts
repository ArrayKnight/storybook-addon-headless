import type { StoryContext } from '@storybook/addons'
import type { AnyValidateFunction } from 'ajv/lib/types'

import type { HeadlessOptions } from './options'
import type { AnySchema } from './schemas'

export enum FetchStatus {
    Inactive = 'INACTIVE',
    Loading = 'LOADING',
    Rejected = 'REJECTED',
    Resolved = 'RESOLVED',
}

export enum VariableType {
    Unknown = 'UNKNOWN',
    Boolean = 'BOOLEAN',
    Date = 'DATE',
    Number = 'NUMBER',
    Select = 'SELECT',
    String = 'STRING',
}

export interface HeadlessState<
    T extends Record<string, unknown> = Record<string, unknown>
> {
    storyId: string
    options: Required<HeadlessOptions>
    status: Record<string, FetchStatus>
    data: T
    errors: Record<string, Record<string, unknown>>
}

export interface VariableState {
    schema: AnySchema
    type: VariableType
    validator: AnyValidateFunction
    dirty: boolean
    error: string | null
    value: unknown
}

export type HeadlessStoryContext<
    T extends Record<string, unknown> = Record<string, unknown>
> = StoryContext & Pick<HeadlessState<T>, 'status' | 'data' | 'errors'>
