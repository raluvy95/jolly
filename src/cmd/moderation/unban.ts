import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Ban extends JollyCommand {
    constructor() {
        super("unban", "moderation", {
            permission: ["BAN_MEMBERS"],
			aliases: ["sorry", "delban", "remban", "removeban", "deleteban"],
            description: "Unban someone. This requires user's ID",
            usage: "<user ID> [reason]"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const isUserID = !isNaN(Number(args[0]))
        if (isUserID) {
            try {
                await client.helpers.unbanMember(config.guildID, args[0])
                return await send(client, message.channelId, `ID: **${args[0]}** has been unbanned!`)
            } catch {
                return await send(client, message.channelId, "That ID is invalid.")
            }
        } else {
            return await send(client, message.channelId, `You need to give an user's ID in order to unban.`)
        }
    }
}

addCommand(new Ban())
