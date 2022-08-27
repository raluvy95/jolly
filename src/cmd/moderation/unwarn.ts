import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { warning } from "@classes/database.ts";

class Unwarn extends JollyCommand {
    constructor() {
        super("unwarn", "moderation", {
            permission: ["KICK_MEMBERS"],
            aliases: ["delwarn", "remwarn", "removewarn", "deletewarn"]
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!args[0]) return send(client, message.channelId, "Missing Case ID")
        const success = warning.remove(args[0])
        if (!success) return send(client, message.channelId, "Cannot find that case ID")
        else return send(client, message.channelId, "Successfully removed warning!")
    }
}

addCommand(new Unwarn())