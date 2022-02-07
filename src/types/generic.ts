export type Identifiable<T> = T & { id: string }

export interface Item {
    label: string
    value: unknown
}

export type ObjectLike = Record<string, unknown> | unknown[] | null | undefined

export type OneOrMore<T> = T | Array<Identifiable<T>>

export type Transform<T = unknown> = (value: T) => T
