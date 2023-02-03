import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";
import { getMember } from "@utils/getCache.ts";

class Exclude extends JollyCommand {
    constructor() {
        super("exclude", "moderation", {
            permission: ["MANAGE_CHANNELS"],
            description: "Exclude a member from current channel.",
            usage: "<member>"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const mentionedMember = message.mentionedUserIds
        const member = mentionedMember.length ? await getMember(client, mentionedMember[0]) : await findMember(client, args[0])
        if (!member) return send(client, message.channelId, "Cannot find that member")
        client.helpers.editChannel(message.channelId, {
            permissionOverwrites: [{
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                type: 1,
                id: member.id
            }]
        })
        return send(client, message.channelId, "**Excluded!**")
    }
}

addCommand(new Exclude())
