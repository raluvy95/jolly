// deno-lint-ignore-file no-unused-vars
import { Bot, BotWithCache, Channel, config, EventHandlers, Member, Message, Role, User } from "@deps";
import { logToEmbed } from "../utils/logToEmbed.ts";
import { send } from "../utils/send.ts";
import { summonWebhook } from "../utils/webhook.ts";

// deno-lint-ignore no-explicit-any
export async function loggingHandler(client: BotWithCache<Bot>, event: keyof EventHandlers, ...args: any) {
    const log = config.plugins.logging
    if (!log.enable) return
    for (const obj of log.events!) {
        if (obj.event == event) {
            const channelID = !obj.channelID ? log.globalChannelID! : obj.channelID
            const e = await logToEmbed(client, obj.event, ...args)
            if (!e) return;
            await summonWebhook(client, channelID, e, "Logging")
            // switch (obj.event) {
            //     case "channelCreate":
            //     case "channelDelete": {
            //         const channel = args[0] as Channel
            //         return send(client, channelID, `${obj.event} - ${channel.id}`);
            //     }
            //     case "guildMemberAdd": {
            //         const member = args[0] as Member
            //         const user = args[1] as User
            //         return send(client, channelID, `${obj.event} - ${member.id}`);
            //     }
            //     case "guildMemberRemove":
            //         return function (client: BotC, user: User, guildid: bigint) {

            //         }
            //     case "guildMemberUpdate":
            //         return function (client: BotC, member: Member, user: User) {

            //         }
            //     case "messageDelete":
            //         return function (client: BotC, payload: {
            //             id: bigint;
            //             channelId: bigint;
            //             guildId?: bigint | undefined;
            //         }, message?: Message) {
            //             console.log(message?.content)
            //         }
            //     case "messageDeleteBulk":
            //         return function (client: BotC, payload: {
            //             ids: bigint[];
            //             channelId: bigint;
            //             guildId?: bigint | undefined;
            //         }) {

            //         }
            //     case "messageUpdate":
            //         return function (client: BotC, message: Message, oldMessage?: Message) {

            //         }
            //     case "roleCreate":
            //         return function (client: BotC, role: Role) {

            //         }
            //     case "roleDelete":
            //         return function (client: BotC, payload: { guildId: bigint; roleId: bigint; }) {

            //         }
            // }
        }
    }
}
