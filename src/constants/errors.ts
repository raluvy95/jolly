export class CommandError extends Error { }
export class EmptyError extends Error { }
export class OverflowError extends Error {
    constructor(value: string, limit: number) {
        super(`${value} cannot have more than ${limit}`)
    }
}
export class SnowflakeError extends Error { }
export class InvalidConfig extends Error { }