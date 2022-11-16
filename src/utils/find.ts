import { Bot, BotWithCache, config, Member, Message, User } from "@deps";

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
            user = client.users.get(nameBigInt) || await client.helpers.getUser(nameBigInt)
        }
    } catch {
        user = client.users.find(m => tag(m.username, m.discriminator) == name || tag(m.username, m.discriminator).startsWith(name))
        if (!user) {
            const member = await client.helpers.searchMembers(config.guildID, name)
            if (member.size < 1) return undefined
            const memberId = member.first()!.id
            user = client.users.get(memberId) || await client.helpers.getUser(memberId)
        }
    }
    return user
}

export async function findMember(client: BotWithCache<Bot>, name: string): Promise<Member | undefined> {
    const member = await client.helpers.searchMembers(config.guildID, name)
    if (member.size < 1) return undefined
    return member.first()
}