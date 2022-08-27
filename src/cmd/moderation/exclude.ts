import { Bot, BotWithCache, config, Member, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";

class Exclude extends JollyCommand {
    constructor() {
        super("exclude", "moderation", {
            permission: ["MANAGE_CHANNELS"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        let member: Member | undefined;
        const mentionedMember = message.mentionedUserIds
        if (mentionedMember.length < 1) {
            member = await findMember(client, args[0])
            if (!member) return send(client, message.channelId, "Cannot find that member")
        }
        member = client.members.get(mentionedMember[0])
        if (!member) {
            member = await client.helpers.getMember(BigInt(config.guildID), mentionedMember[0])
            if (!member) return send(client, message.channelId, "Cannot find that member")
        }
        client.helpers.editChannel(message.channelId, {
            permissionOverwrites: [{
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                type: 1,
                id: member.id
            }]
        })
        return await send(client, message.channelId, "**Excluded!**")
    }
}

addCommand(new Exclude())