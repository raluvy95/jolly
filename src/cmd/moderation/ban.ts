import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";

class Ban extends JollyCommand {
    constructor() {
        super("ban", "moderation", {
            permission: ["BAN_MEMBERS"],
            description: "Ban someone. This also can ban someone who's not in this server (known as hack ban).",
            usage: "<member> [reason]"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const isUserID = !isNaN(Number(args[0]))
        const reason = args.slice(1).join(" ")
        if (isUserID) {
            try {
                await client.helpers.banMember(config.guildID, args[0], { reason })
                return await send(client, message.channelId, `ID: **${args[0]}** has been banned!`)
            } catch {
                return await send(client, message.channelId, "That ID is invalid.")
            }
        } else {
            const member = await findMember(client, args[0])
            if (!member) return send(client, message.channelId, "Cannot find that member")
            await client.helpers.banMember(config.guildID, member.id, { reason })
            return await send(client, message.channelId, `<@${member.id}> has been banned!`)
        }
    }
}

addCommand(new Ban())