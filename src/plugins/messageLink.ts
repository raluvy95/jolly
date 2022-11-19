import { Bot, BotWithCache, config, CreateMessage, Message } from "@deps";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { send } from "@utils/send.ts";

export async function messageLink(client: BotWithCache<Bot>, message: Message) {
    if (!config.plugins.showContentOnMessageLink) return;
    const matched = message.content.match(/http(s)?:\/\/discord.com\/channels\/[0-9]{17,}\/[0-9]{17,}\/[0-9]{17,}/g)
    if (!matched) return;
    const [_guildid, channelid, messageid] = matched[0].split("/").filter(m => +m === +m && m.length > 0)
    try {
        let result: CreateMessage = {}
        const msg = await client.helpers.getMessage(channelid, messageid)
        const author = client.users.get(msg.authorId) || await client.helpers.getUser(msg.authorId)
        const e = new JollyEmbed()
            .setFooter(author.username, await avatarURL(client, msg.authorId))
            .setTitle("Message Reference (click to jump)")
            .setURL(matched[0])
            .setTime(msg.timestamp)
        if (msg.content.length > 0) {
            e.setDesc(msg.content)
        }
        result = {
            embeds: e.build()
        }
        if (msg.attachments.length > 0) {
            result.file = []
            for (const a of msg.attachments) {
                result.file.push({
                    name: a.filename,
                    blob: await fetch(a.url).then(r => r.blob())
                })
            }
        }
        if (msg.embeds.length > 0) {
            for (const em of msg.embeds) {
                result.embeds?.push(em)
            }
        }
        send(client, message.channelId, result)
    } catch { return; }
}