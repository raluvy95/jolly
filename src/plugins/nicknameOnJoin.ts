import { Bot, BotWithCache, config, Member, User } from "@deps";


export const nicknameOnJoin = async (client: BotWithCache<Bot>, member: Member, user: User): Promise<void> => {
    const nick = config.plugins.nicknameOnJoin.nickname
    let name = member.nick
    if (!name) {
        name = user.username
    }
    if (BigInt(config.guildID) !== member.guildId) return;
    const nickNoTemp = nick.replace("{user}", "")
    if (!name.toLowerCase().startsWith(nickNoTemp)) {
        const shortNick = name.slice(0, 36 - nickNoTemp.length);
        const newUser = nick.replace("{user}", shortNick)
        try {
            await client.helpers.editMember(BigInt(config.guildID), member.id, {
                nick: newUser
            })
        } catch { return; }
        return
    }
}