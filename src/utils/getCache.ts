import { BigString, Bot, BotWithCache, config } from "@deps";

export async function getMember(client: BotWithCache<Bot>, memberId: BigString) {
    let member = client.members.get(client.transformers.snowflake(`${memberId}${config.guildID}`))

    if (!member) {
        member = await client.helpers.getMember(config.guildID, memberId)
    }

    return member
}

export async function getUser(client: BotWithCache<Bot>, userId: BigString) {
    let user = client.users.get(client.transformers.snowflake(userId))

    if (!user) {
        user = await client.helpers.getUser(userId)
    }

    return user
}