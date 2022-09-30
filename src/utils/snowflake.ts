import { SnowflakeError } from "@const/errors.ts"
import { dateToString } from "@utils/dateToString.ts"

export function snowflake(DiscordID: string | bigint): Date {
    if (!DiscordID.toString().match(/^(?<id>\d{17,19})$/)) throw new SnowflakeError("Invalid ID")
    let binary = Number(DiscordID.toString()).toString(2)
    while (binary.length < 64) {
        binary = "0" + binary
    }
    const timestampBinary = binary.slice(0, 42)
    const timestamp = parseInt(timestampBinary, 2) + 1420070400000
    return new Date(timestamp)
}

export function createdAt(DiscordID: bigint): string {
    const data = snowflake(DiscordID)
    return dateToString(data)
}
