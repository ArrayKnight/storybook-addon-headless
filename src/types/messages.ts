import { HeadlessOptions } from './options'
import { HeadlessState } from './state'

export interface InitializeMessage {
    storyId: string
    options: HeadlessOptions
}

export type UpdateMessage = Pick<HeadlessState, 'status' | 'data' | 'errors'>
