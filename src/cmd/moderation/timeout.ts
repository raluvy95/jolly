import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { ms } from "https://deno.land/x/ms@v0.1.0/ms.ts";
import { findMember } from "@utils/find.ts";

class Timeout extends JollyCommand {
    constructor() {
        super("timeout", "moderation", {
            aliases: ["mute"],
            description: "Timeout someone. If no time is specified, defaults to 2 hours",
            usage: "<member> [time]",
            permission: ["MODERATE_MEMBERS"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const member = await findMember(client, args[0])
        if (!member) return send(client, message.channelId, "Cannot find that member")
        if (typeof member.communicationDisabledUntil !== "undefined" && member.communicationDisabledUntil > Date.now()) return send(client, message.channelId, "That member is already muted.")
        const secondArg = args.slice(1).join(" ")
        const time = ms(secondArg.length > 1 ? args.slice(1).join(" ") : '2 hours') || ms('2 hours')
        const date = new Date()
        await client.helpers.editMember(config.guildID, member.id, {
            communicationDisabledUntil: date.setMilliseconds(date.getMilliseconds() + Number(time))
        })
        send(client, message.channelId, `<@${member.id}> has been muted for **${ms(String(time), { long: true })}!**`)
    }
}

addCommand(new Timeout())
