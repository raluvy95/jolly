import { Bot, BotWithCache, Channel, CreateMessage, Message, Role, User } from "@deps";
import { JollyEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { AllowedEvents } from "../interfaces/plugins.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { relativeTimeFromDates } from "@utils/dateToString.ts";
import { snowflake } from "@utils/snowflake.ts";

// deno-lint-ignore no-explicit-any
export async function logToEmbed(client: BotWithCache<Bot>, event: AllowedEvents, ...args: any) {
    const e = new JollyEmbed()
    switch (event) {
        case "channelCreate":
        case "channelDelete": {
            const channel = args[0] as Channel
            e.setColor(event == "channelCreate" ? COLORS.GREEN : COLORS.RED)
                .setTitle(event == "channelCreate" ? "Channel Created" : "Channel Deleted")
                .setDesc(`**ID:** ${channel.id}\n**Name:**${channel.name}`)
            break
        }
        case "guildMemberRemove":
        case "guildMemberAdd": {
            const user = event == "guildMemberAdd" ? args[1] as User : args[0] as User
            e.setColor(event == "guildMemberAdd" ? COLORS.GREEN : COLORS.RED)
                .setTitle(event == "guildMemberAdd" ? "Member Joined" : "Member Left")
                .setThumb(await avatarURL(client, user))
                .setDesc(`**ID:** ${user.id}\n**Name:** ${user.username}#${user.discriminator}\n**Discord Member since:** ${relativeTimeFromDates(snowflake(user.id))}`)
            break
        }
        case "messageDelete": {
            const payload = args[0] as {
                id: bigint;
                channelId: bigint;
                guildId?: bigint | undefined;
            }
            const msg = args[1] as Message | undefined
            if (!msg) return;
            const user = client.users.get(msg.authorId) || await client.helpers.getUser(msg.authorId)
            const result: CreateMessage = {}
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
            e.setColor(COLORS.RED)
                .setTitle(`Message Deleted in <#${payload.channelId}>`)
                .setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
                .setDesc(msg.content)
                .setFooter(`ID: ${payload.id}`)
            return { embeds: e.build(), ...result }
        }
        case "messageDeleteBulk": {
            const payload = args[0] as {
                ids: bigint[];
                channelId: bigint;
                guildId?: bigint | undefined;
            }
            e.setColor(COLORS.RED)
                .setTitle(`Message Bulk Deleted in <#${payload.channelId}>`)
                .setDesc(`**${payload.ids.length} message${payload.ids.length == 1 ? '' : 's'}** were purged`)
            break
        }
        case "messageUpdate": {
            const message = args[0] as Message
            const oldMessage = args[1] as Message | undefined
            if (!oldMessage) return;
            const user = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
            e.setColor(COLORS.YELLOW)
                .setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
                .setTitle(`Message Edited in <#${message.channelId}>`)
                .addField("Before", oldMessage.content.slice(0, 1990))
                .addField("After", message.content.slice(0, 1990))
                .setFooter(`ID: ${message.id}`)
            break
        }
        case "roleDelete":
        case "roleCreate": {
            const role = args[0] as Role
            e.setColor(event == "roleCreate" ? COLORS.GREEN : COLORS.RED)
                .setTitle(event == "roleCreate" ? "Role Created" : "Role Deleted")
                .setDesc(`**ID:** ${role.id}\n**Name:** ${role.name}`)
            break
        }
    }
    return e.build()
}