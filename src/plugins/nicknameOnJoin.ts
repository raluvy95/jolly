import { config, Member, User } from "@deps";
import { JollyBot } from "@classes/client.ts";


export const nicknameOnJoin = (client: JollyBot, member: Member, user: User) => {
    if (!config.plugins.nicknameOnJoin.enable) return;

    const nick = config.plugins.nicknameOnJoin.nickname
    const name = member.nick || user.username
    if (BigInt(config.guildID) !== member.guildId) return;
    const nickNoTemp = nick!.replace("{user}", "")
    if (!name.toLowerCase().startsWith(nickNoTemp)) {
        const shortNick = name.slice(0, 36 - nickNoTemp.length);
        const newUser = nick!.replace("{user}", shortNick)
        try {
            client.helpers.editMember(config.guildID, member.id, {
                nick: newUser
            })
        } catch { return; }
        return
    }
}
