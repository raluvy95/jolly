import { config, Member, Message, User } from "@deps";
import { JollyBot } from "@classes/client.ts";

function tag(user: string, tag: string) {
    return user + "#" + tag
}

export async function findUser(client: JollyBot, name: string, message?: Message): Promise<User | undefined> {
    let user: User | undefined
    if (message && message.mentionedUserIds.length > 0) {
        return findUser(client, String(message.mentionedUserIds[0]))
    }
    try {
        const nameBigInt = BigInt(name)
        if (!isNaN(Number(nameBigInt))) {
            user = await client.cache.users.get(nameBigInt) || await client.helpers.getUser(nameBigInt)
        }
    } catch {
        user = client.cache.users.memory.find(m => tag(m.username, m.discriminator) == name || tag(m.username, m.discriminator).startsWith(name))
        if (!user) {
            const member = await client.helpers.searchMembers(config.guildID, name)
            if (member.size < 1) return undefined
            const memberId = member.first()!.id
            user = await client.cache.users.get(memberId) || await client.helpers.getUser(memberId)
        }
    }
    return user
}

export async function findMember(client: JollyBot, name: string): Promise<Member | undefined> {
    const mentionedReg = /<@(!?)[0-9]{17,}>/g
    const matched = name.match(mentionedReg)
    if (!matched) {
        const member = await client.helpers.searchMembers(config.guildID, name)
        if (member.size < 1) return undefined
        return member.first()
    } else {
        return await client.helpers.getMember(config.guildID, matched[0].replace(/<@(!?)/, '').replace(">", ''))
    }
}