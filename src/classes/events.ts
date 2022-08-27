import { Bot, BotWithCache, config, EventHandlers, Interaction, Member, Message, User } from "@deps"
import { commandHandler, refreshCommand } from "@classes/command.ts"
import { debug, main } from "@utils/log.ts";
import { bumpReminder } from "@plugins/bumpReminder.ts";
import { nicknameOnJoin } from "@plugins/nicknameOnJoin.ts";
import { autorole } from "@plugins/autorole.ts";
import { autoPublish } from "@plugins/autopublish.ts";
import { ree } from "@plugins/ree.ts";
import { selfping } from "@plugins/selfping.ts";
import { autopost } from "@plugins/autopost.ts";
import { autoCreateChannel } from "@plugins/autocreate.ts";
import { ghostPingD, ghostPingU, Payload } from "@plugins/ghostPing.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.4/mod.ts";
import { IResultDB, warning } from "@classes/database.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { send } from "@utils/send.ts";
import { sentence } from "@plugins/sentence.ts";
import { recentWarnings } from "@utils/recentWarnings.ts";

export const warnEvent = new EventEmitter<{
    warnTrigger(bot: BotWithCache<Bot>, data: IResultDB, user?: User): void
}>()

warnEvent.on("warnTrigger", async (client: BotWithCache<Bot>, data: IResultDB, user?: User) => {
    const e = new JollyEmbed()
    if (user) {
        e.setAuthor(`${user.username}#${user.discriminator}`, await avatarURL(client, user))
    }
    const member = client.members.get(data.userid) || await client.helpers.getMember(BigInt(config.guildID), data.userid)
    // deno-lint-ignore no-empty
    if (!member) { }
    else {
        sentence(client, member, recentWarnings(warning.getByUser(member.id)).length)
    }

    let channel = client.channels.get(BigInt(config.warnLog.channelID))
    if (!channel) {
        channel = await client.helpers.getChannel(BigInt(config.warnLog.channelID))
        if (!channel) return main.error("Cannot find channel ID to send warning logs!")
    }
    return await send(client, channel.id, e.warn(data))

})

export const JollyEvent = {
    async ready(bot: BotWithCache<Bot>) {
        main.info("I'm ready!");
        await refreshCommand();
        autopost(bot)
    },

    async messageCreate(bot: BotWithCache<Bot>, message: Message): Promise<void> {
        await bumpReminder(bot, message);
        await autoPublish(bot, message, true, config.plugins.autoPublish.botOnlyChannelID)
        await autoPublish(bot, message, false, config.plugins.autoPublish.channelID)
        if (message.isFromBot)
            return;
        const success = await commandHandler(bot, message);
        if (!success) {
            await ree(bot, message)
            await selfping(bot, message)
            await autoCreateChannel(bot, message)
        }
    },

    async messageDelete(client: BotWithCache<Bot>, payload: Payload, message: Message) {
        await ghostPingD(client, payload, message)
    },

    async messageUpdate(client: BotWithCache<Bot>, message: Message, oldMessage?: Message) {
        await ghostPingU(client, message, oldMessage)
    },

    debug(info: string): void {
        if (Deno.env.get("DEV")) {
            debug.info(info);
        }
    },

    interactionCreate(client: BotWithCache<Bot>, i: Interaction): void {
        if (i.type == 3 && i.data?.customId == "delete") {
            client.helpers.deleteMessage(i.channelId as bigint, i.message?.id as bigint)
        }
    },

    async guildMemberUpdate(client: BotWithCache<Bot>, member: Member, user: User): Promise<void> {
        await nicknameOnJoin(client, member, user)
        // for who has passed the membership screening 
        await autorole(client, member, user)
    },

    async guildMemberAdd(client: BotWithCache<Bot>, member: Member, user: User): Promise<void> {
        await nicknameOnJoin(client, member, user)
        await autorole(client, member, user)
    }
} as unknown as Partial<EventHandlers>