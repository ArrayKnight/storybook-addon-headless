export type Identifiable<T extends unknown> = T & { id: string }

export interface Item {
    label: string
    value: unknown
}

export type ObjectLike = Record<string, unknown> | unknown[] | null | undefined

export type OneOrMore<T extends unknown> = T | Array<Identifiable<T>>

export type Transform<T = unknown> = (value: T) => T
