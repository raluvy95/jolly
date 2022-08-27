import { SnowflakeError } from "@const/errors.ts"
import { dateToString } from "./dateToString.ts"

export function snowflake(DiscordID: string): Date {
    if (!DiscordID.match(/^(?<id>\d{17,19})$/)) throw new SnowflakeError("Invalid ID")
    let binary = Number(DiscordID).toString(2)
    while (binary.length < 64) {
        binary = "0" + binary
    }
    const timestampBinary = binary.slice(0, 42)
    const timestamp = parseInt(timestampBinary, 2) + 1420070400000
    return new Date(timestamp)
}

export function createdAt(DiscordID: bigint): string {
    const str = DiscordID.toString()
    const data = snowflake(str)
    return dateToString(data)
}