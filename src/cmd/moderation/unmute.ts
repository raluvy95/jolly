import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";

class Timeout extends JollyCommand {
    constructor() {
        super("unmute", "moderation", {
            aliases: ["untimeout"],
            description: "Unmute someone.",
            usage: "<member>",
            permission: ["MODERATE_MEMBERS"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const member = await findMember(client, args[0])
        if (!member) return send(client, message.channelId, "Cannot find that member")
        if (typeof member.communicationDisabledUntil == "undefined" || member.communicationDisabledUntil < Date.now()) return send(client, message.channelId, "That member is already unmuted.")
        await client.helpers.editMember(config.guildID, member.id, {
            communicationDisabledUntil: Date.now()
        })
        send(client, message.channelId, `<@${member.id}> has been unmuted!`)
    }
}

addCommand(new Timeout())