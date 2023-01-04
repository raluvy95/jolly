import { BigString, Bot, BotWithCache, config, User } from "@deps";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { send } from "@utils/send.ts";
import { escape } from "@utils/escapeTxt.ts"
import { FuncContextMessage } from "../interfaces/plugins.ts";

export async function greeting(client: BotWithCache<Bot>, user: User, guildId: bigint, type: "join" | "leave" | "ban") {
    const welcomer = config.plugins.greeting
    if (!welcomer.enable) return;
    const { name, memberCount, approximateMemberCount } = await client.helpers.getGuild(guildId, { counts: true })
    const author = escape(user.username) + "#" + user.discriminator

    async function parse(channelId: BigString, customMsg: FuncContextMessage | string) {
        if (typeof customMsg == "string") {
            const result = customMsg.replace("{author}", author)
                .replace("{server}", name)
                .replace("{memberCount}", (approximateMemberCount || memberCount).toString())
                .replace("{mention}", `<@${user.id}>`)
            return await send(client, channelId, result)
        } else {
            return await send(client, channelId, customMsg!({
                embed: new JollyEmbed(),
                author: author,
                memberCount: approximateMemberCount || memberCount,
                authorAvatarURL: await avatarURL(client, user),
                mention: `<@${user.id}>`,
                serverName: name
            }))
        }
    }
    let result: {
        enable: boolean,
        channelID: string
        customMessage: FuncContextMessage | string
    };
    switch (type) {
        case "join":
            if (!welcomer.join!.enable) return;
            result = welcomer.join!
            break
        case "leave":
            if (!welcomer.leave!.enable) return;
            result = welcomer.leave!
            break
        case "ban":
            if (!welcomer.ban!.enable) return;
            result = welcomer.ban!
    }
    await parse(result.channelID, result.customMessage)
}