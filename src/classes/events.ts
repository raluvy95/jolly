import { ActivityTypes, BigString, brightGreen, brightRed, Channel, config, cyan, EventHandlers, Interaction, InteractionResponseTypes, InteractionTypes, Member, Message, MessageComponentTypes, Role, User } from "@deps"
import { commandHandler, refreshCommand } from "@classes/command.ts"
import { debug, main } from "@utils/log.ts";
import { ghostPingD, ghostPingU, Payload, autoCreateChannel, bumpReminder, nicknameOnJoin, autorole, autoPublish, ree, selfping, autopost, sentence, sudo, autoRenameChannel, clock, RSS } from "@plugins/mod.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.4/mod.ts";
import { IResultDB, warning } from "@classes/warning.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { send } from "@utils/send.ts";
import { recentWarnings } from "@utils/recentWarnings.ts";
import { handleXP, level } from "@classes/level.ts";
import { funfact } from "@plugins/funfact.ts";
import { messageLink } from "@plugins/messageLink.ts";
import { ReactionAddPayload, ReactionRmPayload } from "../interfaces/reactionpayload.ts";
import { reaction, reactionInit } from "@plugins/reactionRole.ts";
import { starboardWatcher } from "@plugins/starboard.ts";
import { loggingHandler } from "@plugins/logging.ts";
import { sniperHandler } from "@classes/snipe.ts";
import { JollyBot } from "@classes/client.ts";

export const warnEvent = new EventEmitter<{
    warnTrigger(bot: JollyBot, data: IResultDB, user?: User): void
}>()

export const levelEvent = new EventEmitter<{
    levelUP(bot: JollyBot, level: number, channel: BigString, userID: string): void
}>()

export let BotUptime: number;

warnEvent.on("warnTrigger", async (client: JollyBot, data: IResultDB, user?: User) => {
    const e = new JollyEmbed()
    if (user) {
        e.setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
    }
    const member = await client.cache.members.get(data.userid, BigInt(config.guildID)) || await client.helpers.getMember(config.guildID, data.userid)
    // deno-lint-ignore no-empty
    if (!member) { }
    else {
        sentence(client, member, recentWarnings(warning.getByUser(member.id)).length)
    }

    if (config.plugins.logging.enable) {
        const channel = await client.cache.channels.get(BigInt(config.plugins.logging.warnLogChannelID!)) || await client.helpers.getChannel(config.plugins.logging.warnLogChannelID!)
        return send(client, channel.id, e.warn(data))
    }
})

levelEvent.on("levelUP", (bot, level, channel, userID) => {
    const conf = config.plugins.levelXP
    const ping = `<@${userID}>`
    const customMsg = conf.levelUP!.customMessage.replace("{user}", ping).replace("{level}", level.toString())
    if (conf.levelUP!.channelID == "0") {
        send(bot, channel, customMsg)
    } else {
        send(bot, conf.levelUP!.channelID, customMsg).catch(() => main.error("Invalid channel ID"))
    }
    const matchedLvlRole = conf.rolesRewards!.find(m => m.level == level)
    if (!matchedLvlRole) return;
    bot.helpers.addRole(config.guildID, userID, matchedLvlRole.ID, "Level UP!")
})

function printPluginsStatus() {
    const plug = config.plugins
    let result = ''
    for (const [k, v] of Object.entries(plug).sort()) {
        result += `${cyan("Plugin")} [${k}]:`
        if ((typeof v == "object" && 'enable' in v && v.enable) ||
            typeof v == "boolean" && v) {
            result += ` ${brightGreen("Enabled")}\n`
        } else {
            result += ` ${brightRed("Disabled")}\n`
        }
    }
    console.log(result)
}

printPluginsStatus()

function isOwner(user: BigString) {
    return config.owners.includes(String(user));
}

export const JollyEvent = {
    ready(bot: JollyBot) {
        BotUptime = Date.now()
        main.info("I'm ready!");
        bot.helpers.editBotStatus({
            activities: [
                {
                    name: !config.playingStatus ? `${config.prefixes[0]}help` : config.playingStatus,
                    type: ActivityTypes.Watching,
                    createdAt: Date.now()
                }
            ],
            status: "dnd"
        })
        refreshCommand();
        autopost(bot)
        autoRenameChannel(bot)
        funfact(bot)
        clock(bot)
        RSS(bot)
        reactionInit(bot)
    },

    messageCreate(bot: JollyBot, message: Message): void {
        bumpReminder(bot, message);
        if (config.plugins.autoPublish.enable) {
            autoPublish(bot, message, true, config.plugins.autoPublish.botOnlyChannelID!)
            autoPublish(bot, message, false, config.plugins.autoPublish.channelID!)
        }
        const allowBotChannel = config.allowBotResponsingCommandChannelID
        let success;

        // allow bots aka webhooks to use command
        if (allowBotChannel.includes(String(message.channelId)) && String(message.authorId) != config.botID) {
            success = commandHandler(bot, message);
        } else if (!message.isFromBot) {
            success = commandHandler(bot, message);
        }
        if (!success) {
            if (message.isFromBot) return;
            sudo(bot, message)
            ree(bot, message)
            selfping(bot, message)
            autoCreateChannel(bot, message)
            handleXP(bot, message)
            messageLink(bot, message)
        }
    },

    messageDelete(client: JollyBot, payload: Payload, message: Message) {
        ghostPingD(client, payload, message)
        loggingHandler(client, "messageDelete", payload, message)
        sniperHandler(client, message)
    },

    messageUpdate(client: JollyBot, message: Message, oldMessage?: Message) {
        const allowBotChannel = config.allowBotResponsingCommandChannelID
        // allow bots aka webhooks to use command
        if (allowBotChannel.includes(String(message.channelId)) && String(message.authorId) != config.botID) {
            commandHandler(client, message);
        } else if (!message.isFromBot) {
            commandHandler(client, message);
        }
        ghostPingU(client, message, oldMessage)
        loggingHandler(client, "messageUpdate", message, oldMessage)
    },

    debug(info: string): void {
        if (Deno.env.get("DEV")) {
            debug.info(info);
        }
    },

    async interactionCreate(client: JollyBot, i: Interaction) {
        if (i.type == InteractionTypes.MessageComponent && i.data?.componentType == MessageComponentTypes.Button) {
            switch (i.data.customId) {
                case "delete":
                    if (!isOwner(i.user.id)) return
                    client.helpers.deleteMessage(i.channelId as bigint, i.message?.id as bigint)
                    break
                case "accept":
                    if (!isOwner(i.user.id)) return
                    level.removeAll()
                    await client.helpers.sendInteractionResponse(i.id, i.token, {
                        type: InteractionResponseTypes.UpdateMessage,
                        data: {
                            content: "Purged everything!",
                            components: []
                        }
                    })
                    break
                case "deny":
                    if (!isOwner(i.user.id)) return
                    await client.helpers.sendInteractionResponse(i.id, i.token, {
                        type: InteractionResponseTypes.UpdateMessage,
                        data: {
                            content: "Cancelled!",
                            components: []
                        }
                    })
                    break
            }
        }
        if (i.type == InteractionTypes.ApplicationCommand && i.data?.name == "jolly") {
            await client.helpers.sendInteractionResponse(i.id, i.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "Jolly does not currently support Slash command. That's all about it!"
                }
            })
        }
    },

    guildMemberUpdate(client: JollyBot, member: Member, user: User) {
        nicknameOnJoin(client, member, user)
        // for who has passed the membership screening 
        autorole(client, member, user)
    },

    guildMemberAdd(client: JollyBot, member: Member, user: User) {
        nicknameOnJoin(client, member, user)
        loggingHandler(client, "guildMemberAdd", member, user)
    },

    guildMemberRemove(client: JollyBot, member: Member, user: User) {
        loggingHandler(client, "guildMemberRemove", member, user)
    },

    reactionAdd(client: JollyBot, payload: ReactionAddPayload) {
        reaction(client, payload, "add")
        starboardWatcher(client, payload, "+")
    },

    reactionRemove(client: JollyBot, payload: ReactionRmPayload) {
        reaction(client, payload, "rm")
        starboardWatcher(client, payload, "-")
    },

    channelCreate(client: JollyBot, channel: Channel) {
        loggingHandler(client, "channelCreate", channel)
    },

    channelDelete(client: JollyBot, channel: Channel) {
        loggingHandler(client, "channelDelete", channel)
    },

    roleCreate(client: JollyBot, role: Role) {
        loggingHandler(client, "roleCreate", role)
    },

    roleDelete(client: JollyBot, payload: { guildId: bigint; roleId: bigint; }) {
        loggingHandler(client, "roleDelete", payload)
    }
} as unknown as EventHandlers
