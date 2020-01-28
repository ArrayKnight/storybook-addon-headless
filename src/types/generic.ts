export interface Dictionary<T = any> {
    [key: string]: T
}

export type Transform<T = any> = (value: T) => T

export type Required<T> = T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]> }
    : T

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
