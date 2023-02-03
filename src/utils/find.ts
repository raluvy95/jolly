import { Bot, BotWithCache, config, Member, Message, User } from "@deps";
import { getMember, getUser } from "@utils/getCache.ts";

function tag(user: string, tag: string) {
    return user + "#" + tag
}

export async function findUser(client: BotWithCache<Bot>, name: string, message?: Message): Promise<User | undefined> {
    let user: User | undefined
    if (message && message.mentionedUserIds.length > 0) {
        return findUser(client, String(message.mentionedUserIds[0]))
    }
    try {
        const nameBigInt = BigInt(name)
        if (!isNaN(Number(nameBigInt))) {
            user = await getUser(client, nameBigInt)
        }
    } catch {
        user = client.users.find(m => tag(m.username, m.discriminator) == name || tag(m.username, m.discriminator).startsWith(name))
        if (!user) {
            const member = await client.helpers.searchMembers(config.guildID, name)
            if (member.size < 1) return undefined
            const memberId = member.first()!.id
            user = await getUser(client, memberId)
        }
    }
    return user
}

export async function findMember(client: BotWithCache<Bot>, name: string): Promise<Member | undefined> {
    const mentionedReg = /<@(!?)[0-9]{17,}>/g
    const matched = name.match(mentionedReg)
    if (!matched) {
        const member = await client.helpers.searchMembers(config.guildID, name)
        if (member.size < 1) return undefined
        return member.first()
    } else {
        return await getMember(client, matched[0].replace(/<@(!?)/, '').replace(">", ''))
    }
}