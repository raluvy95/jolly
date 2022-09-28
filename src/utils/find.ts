import { Bot, BotWithCache, config, Member, User } from "@deps";

export async function findUser(client: BotWithCache<Bot>, name: string): Promise<User | undefined> {
    let user: User | undefined
    try {
        const nameBigInt = BigInt(name)
        if (!isNaN(Number(nameBigInt))) {
            user = client.users.get(nameBigInt) || await client.helpers.getUser(nameBigInt)
        }
    } catch {
        user = client.users.find(m => m.username == name || m.username.startsWith(name))
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