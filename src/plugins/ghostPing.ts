import { Bot, BotWithCache, config, Message, MessageTypes, User } from "@deps";
import { JollyEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { send } from "@utils/send.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

export interface Payload {
    id: bigint;
    channelId: bigint;
    guildId?: bigint;
}

export async function ghostPingU(client: BotWithCache<Bot>, message: Message, oldMessage?: Message) {
    if (!config.plugins.ghostPing) return;
    if (!oldMessage) return;
    const oldFiltered = oldMessage.mentionedUserIds.filter(m => m != message.authorId)
    const newFiltered = message.mentionedUserIds.filter(m => m != message.authorId)
    if (oldFiltered.length != newFiltered.length) {
        const foundUserID: BigInt[] = [];
        newFiltered.forEach(id => {
            if (oldFiltered.indexOf(id) == -1) {
                foundUserID.push(id)
            }
        })
        if (foundUserID.length < 1) return;
        const user = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
        if (!user) return;
        send(client, message.channelId, await embed(foundUserID.map(m => `<@${m}>`).join(", "), client, user))
    }
}

async function buff(data: string) {
    const buffer = Base64.fromFile(data)
    const url = `data:image/png;charset=utf-8;base64,${buffer.toString()}`;
    return await (await fetch(url)).blob()
}

async function embed(mentions: string, client: BotWithCache<Bot>, user: User) {
    const b = await buff("./assets/pinged.png")
    const e = new JollyEmbed()
        .setTitle("Ghost ping found!")
        .setColor(COLORS.RED)
        .setDesc(mentions)
        .setAuthor(user.username, await avatarURL(client, user))
        .setThumb(`attachment://pinged.png`)
        .build()
    return {
        embeds: e, file: {
            name: "pinged.png",
            blob: b
        }
    }
}

export async function ghostPingD(client: BotWithCache<Bot>, payload: Payload, message?: Message) {
    if (!config.plugins.ghostPing || !message) return;
    // for some reasons, reply with pinged triggers this
    let filtered = message.mentionedUserIds.filter(m => m != message.authorId)
    if (filtered.length < 1) return;
    if (message.type == MessageTypes.Reply) {
        if (message.messageReference?.messageId) {
            const userid = (await client.helpers.getMessage(message.channelId, message.messageReference.messageId)).authorId
            filtered = filtered.filter(m => m != userid)
        }
    }
    if (filtered.length < 1) return;
    const user = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
    if (!user) return;
    send(client, payload.channelId, await embed(filtered.map(m => `<@${m}>`).join(", "), client, user))
}
