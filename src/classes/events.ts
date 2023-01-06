import { ActivityTypes, BigString, Bot, BotWithCache, brightGreen, brightRed, config, cyan, EventHandlers, Interaction, InteractionResponseTypes, InteractionTypes, Member, Message, MessageComponentTypes, User } from "@deps"
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
import { reaction } from "@plugins/reactionRole.ts";
import { starboardWatcher } from "@plugins/starboard.ts";
import { greeting } from "../plugins/greeting.ts";

export const warnEvent = new EventEmitter<{
    warnTrigger(bot: BotWithCache<Bot>, data: IResultDB, user?: User): void
}>()

export const levelEvent = new EventEmitter<{
    levelUP(bot: BotWithCache<Bot>, level: number, channel: BigString, userID: string): void
}>()

export let BotUptime: number;

warnEvent.on("warnTrigger", async (client: BotWithCache<Bot>, data: IResultDB, user?: User) => {
    const e = new JollyEmbed()
    if (user) {
        e.setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
    }
    const member = client.members.get(data.userid) || await client.helpers.getMember(config.guildID, data.userid)
    // deno-lint-ignore no-empty
    if (!member) { }
    else {
        sentence(client, member, recentWarnings(warning.getByUser(member.id)).length)
    }

    if (config.plugins.logging.enable) {
        const channel = client.channels.get(BigInt(config.plugins.logging.warnLogChannelID!)) || await client.helpers.getChannel(config.plugins.logging.warnLogChannelID!)
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
    ready(bot: BotWithCache<Bot>) {
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
    },

    messageCreate(bot: BotWithCache<Bot>, message: Message): void {
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

    messageDelete(client: BotWithCache<Bot>, payload: Payload, message: Message) {
        ghostPingD(client, payload, message)
    },

    messageUpdate(client: BotWithCache<Bot>, message: Message, oldMessage?: Message) {
        ghostPingU(client, message, oldMessage)
    },

    debug(info: string): void {
        if (Deno.env.get("DEV")) {
            debug.info(info);
        }
    },

    async interactionCreate(client: BotWithCache<Bot>, i: Interaction) {
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

    guildMemberUpdate(client: BotWithCache<Bot>, member: Member, user: User) {
        nicknameOnJoin(client, member, user)
        // for who has passed the membership screening 
        autorole(client, member, user)
    },

    guildMemberAdd(client: BotWithCache<Bot>, member: Member, user: User) {
        nicknameOnJoin(client, member, user)
        greeting(client, user, member.guildId, "join")
    },

    guildMemberRemove(client: BotWithCache<Bot>, user: User, guildId: bigint) {
        greeting(client, user, guildId, "leave")
    },

    guildBanAdd(client: BotWithCache<Bot>, user: User, guildId: bigint) {
        greeting(client, user, guildId, "ban")
    },

    reactionAdd(client: BotWithCache<Bot>, payload: ReactionAddPayload) {
        reaction(client, payload, "add")
        starboardWatcher(client, payload, "+")
    },

    reactionRemove(client: BotWithCache<Bot>, payload: ReactionRmPayload) {
        reaction(client, payload, "rm")
        starboardWatcher(client, payload, "-")
    },

} as unknown as Partial<EventHandlers>