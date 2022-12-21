import { config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";
import { JollyBot } from "@classes/client.ts";

class Kick extends JollyCommand {
    constructor() {
        super("kick", "moderation", {
            permission: ["KICK_MEMBERS"],
            description: "Kick someone",
            cooldown: 30,
            usage: "<member> [reason]"
        })
    }

    override async run(message: Message, args: string[], client: JollyBot) {
        const member = await findMember(client, args[0])
        if (!member) return send(client, message.channelId, "Cannot find that member")
        let reason = args.slice(1).join(" ")
        if (reason.length < 1) {
            reason = `Kicked by ID: ${message.authorId}`
        } else {
            reason += `  | Kicked by ID: ${message.authorId}`
        }
        await client.helpers.kickMember(config.guildID, member.id, reason)
        return send(client, message.channelId, `<@${member.id}> has been kicked!`)
    }
}

addCommand(new Kick())