import { Bot, BotWithCache, Channel, CreateMessage, Member, Message, Role, User, VoiceState } from "@deps";
import { JollyEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { AllowedEvents } from "../interfaces/plugins.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { relativeTimeFromDates } from "@utils/dateToString.ts";
import { snowflake } from "@utils/snowflake.ts";

function content(str: string) {
    return str.length > 3500 ? str.slice(0, 3500) : str
}

function undefine(str?: string) {
    if (!str) {
        return "None"
    } else return str
}

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
                .setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
                .setDesc(`**Message Deleted in <#${payload.channelId}>**\n\n ${content(msg.content)}`)
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
                .setDesc(`**Message Bulk Deleted in <#${payload.channelId}>**\n\n**${payload.ids.length} message${payload.ids.length == 1 ? '' : 's'}** were purged`)
            break
        }
        case "messageUpdate": {
            const message = args[0] as Message
            const oldMessage = args[1] as Message | undefined
            if (!oldMessage) return;
            const user = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
            e.setColor(COLORS.YELLOW)
                .setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
                .setDesc(`**Message Edited in <#${message.channelId}>**`)
                .addField("Before", oldMessage.content.slice(0, 1990))
                .addField("After", message.content.slice(0, 1990))
                .setFooter(`ID: ${message.id}`)
            break
        }
        case "guildMemberUpdateCache": {
            const member = args[0] as Member
            const oldMember = args[1] as Member
            const user = args[2] as User
            e.setAuthor(user.username + "#" + user.discriminator, await avatarURL(client, user))
            if (member.nick != oldMember.nick) {
                e.setTitle("Nickname change")
                    .setColor(COLORS.YELLOW)
                    .addField("Before", undefine(oldMember.nick))
                    .addField("After", undefine(member.nick))
            } else if (member.roles.length != oldMember.roles.length) {
                const differentBeforeRole = [];
                const differentAfterRole = []
                for (const r of oldMember.roles) {
                    if (member.roles.indexOf(r) == -1) {
                        differentBeforeRole.push(r)
                    }
                }
                for (const r of member.roles) {
                    if (oldMember.roles.indexOf(r) == -1) {
                        differentAfterRole.push(r)
                    }
                }
                if (differentAfterRole.length > 0) {
                    e.setTitle("Role Added")
                        .setDesc(`Added role${differentAfterRole.length == 1 ? '' : 's'}: ` + differentAfterRole.map(m => `<@&${m}>`).join(", "))
                        .setFooter(`ID: ${member.id}`)
                        .setColor(COLORS.GREEN)
                } else if (differentBeforeRole.length > 0) {
                    e.setTitle("Role Removed")
                        .setDesc(`Removed role${differentBeforeRole.length == 1 ? '' : 's'}: ` + differentBeforeRole.map(m => `<@&${m}>`).join(", "))
                        .setFooter(`ID: ${member.id}`)
                        .setColor(COLORS.RED)
                }
            }
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
        case "voiceStateUpdateCache": {
            const vs = args[0] as VoiceState
            const oldvs = args[1] as VoiceState
            const user = client.users.get(vs.userId) || await client.helpers.getUser(vs.userId)
            e.setAuthor(user.username + "#" + user.discriminator, await avatarURL(client, user))
            if (!vs.channelId) {
                const channel = client.channels.get(oldvs.channelId!) || await client.helpers.getChannel(oldvs.channelId!)
                e.setTitle("VC Left")
                    .setDesc(`**Name:** ${channel.name}`)
                    .setColor(COLORS.RED)
                    .setFooter(`ID: ${vs.userId}`)
                break
            }
            const channel = client.channels.get(vs.channelId) || await client.helpers.getChannel(vs.channelId)
            if (oldvs.toggles.deaf != vs.toggles.deaf) {
                e.setTitle(!oldvs.toggles.deaf ? "Member Deafed" : "Member Undeafed")
            } else if (oldvs.toggles.mute != vs.toggles.mute) {
                e.setTitle(!oldvs.toggles.mute ? "Member Muted" : "Member Unmuted")
            } else if (oldvs.toggles.selfDeaf != vs.toggles.selfDeaf) {
                e.setTitle(!oldvs.toggles.selfDeaf ? "Member Deafed" : "Member Undeafed")
            } else if (oldvs.toggles.selfMute != vs.toggles.selfMute) {
                e.setTitle(!oldvs.toggles.selfMute ? "Member Muted" : "Member Unmuted")
            } else if (oldvs.toggles.selfStream != vs.toggles.selfStream) {
                e.setTitle(!oldvs.toggles.selfStream ? "Member started streaming" : "Member stopped streaming")
            } else if (oldvs.toggles.selfVideo != vs.toggles.selfVideo) {
                e.setTitle(!oldvs.toggles.selfVideo ? "Member showed their webcam" : "Member stopped showing their webcam")
            } else if (!oldvs.channelId) {
                e.setTitle("VC Joined")
            }
            e.setDesc(`**Channel Name:** ${channel.name}`)
                .setColor(COLORS.YELLOW)
                .setFooter(`ID: ${vs.userId}`)
            break
        }
    }
    return e.build()
}