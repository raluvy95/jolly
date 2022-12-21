import { config, CreateMessage, Message } from "@deps";
import { ReactionRmPayload } from "../interfaces/reactionpayload.ts";
import { getEmojiName } from "@utils/getemojiname.ts";
import { send } from "@utils/send.ts";
import { starboardDB } from "@classes/starboardDB.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { JollyBot } from "@classes/client.ts";

type IsItNegativeOrPositive = "-" | "+"

function parseMessageURL(msg: Message) {
    return `[Jump to message](https://discord.com/channels/${config.guildID}/${msg.channelId}/${msg.id})`
}

async function resolveMessage(msg: Message, client: JollyBot, content: string) {
    try {
        let result: CreateMessage = {}
        const author = await client.cache.users.get(msg.authorId) || await client.helpers.getUser(msg.authorId)
        const e = new JollyEmbed()
            .setAuthor(author.username, await avatarURL(client, msg.authorId))
            .setTime(msg.timestamp)
            .setDesc(parseMessageURL(msg))
        if (msg.content.length > 0) {
            if (msg.content.length >= 2000) {
                msg.content = msg.content.slice(0, 1997) + "..."
            }
            e.setDesc(msg.content + "\n\n" + parseMessageURL(msg))
        }
        result = {
            content: `${content} | <#${msg.channelId}>`,
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
        return result
    } catch { return; }
}

export async function starboardWatcher(client: JollyBot, reaction: ReactionRmPayload, type: IsItNegativeOrPositive) {
    const starConf = config.plugins.starboard
    if (!starConf.enable) return;
    if (reaction.userId == client.id) return;
    const emoji = !starConf.customEmoji ? "⭐" : starConf.customEmoji
    if (reaction.emoji.name == getEmojiName(emoji)) {
        const msg = await client.cache.messages.get(reaction.messageId) || await client.helpers.getMessage(reaction.channelId, reaction.messageId)
        if (starConf.ignoreReactionYourself && reaction.userId == msg.authorId) return;
        if (!msg.reactions) return;
        const react = msg.reactions.find(m => m.emoji.name == getEmojiName(emoji))
        if (!react) throw new Error("what.")
        if (react.count >= starConf.requiredStarCount!) {
            const dbstar = starboardDB.get(msg.id)
            if (!dbstar) {
                const sourcedb = starboardDB.getSource(msg.id)
                if (!sourcedb) {
                    const { id } = await send(client, starConf.channelID!, (await resolveMessage(msg, client, `${emoji} **${react.count}**`))!)
                    await client.helpers.addReaction(starConf.channelID!, id, emoji)
                    starboardDB.setStar(msg.id, msg.channelId, react.count, id)
                    return
                }
                if (type == "+") {
                    sourcedb.starCount++
                } else {
                    sourcedb.starCount--
                }
                msg.content = `${emoji} **${sourcedb.starCount}** | <#${sourcedb.channelid}>`

                const { id } = await client.helpers.editMessage(msg.channelId, sourcedb.sourceMessageid, msg as CreateMessage)
                starboardDB.setStar(msg.id, sourcedb.channelid, sourcedb.starCount, id)
                return
            } else if (msg.channelId == BigInt(starConf.channelID!) && msg.id == BigInt(dbstar.sourceMessageid)) {
                if (type == "+") {
                    dbstar.starCount++
                } else {
                    dbstar.starCount--
                }
                msg.content = `${emoji} **${dbstar.starCount}** | <#${dbstar.channelid}>`
                const { id } = await client.helpers.editMessage(msg.channelId, msg.id, msg as CreateMessage)
                starboardDB.setStar(msg.id, dbstar.channelid, dbstar.starCount, id)
                return
            }
        }
    }
}