export interface Dictionary<T = any> {
    [key: string]: T
}

export type Identifiable<T extends {}> = T & { id: string }

export interface Item {
    label: string
    value: any
}

export type OneOrMore<T extends {}> = T | Identifiable<T>[]

export type Required<T> = T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]> }
    : T

export type Transform<T = any> = (value: T) => T

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
