import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { warning } from "@classes/warning.ts";

class Reason extends JollyCommand {
    constructor() {
        super("reason", "moderation", {
            permission: ["KICK_MEMBERS"],
            usage: "<case id> <reason>",
            description: "Set reason for warning"
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!args[0]) return send(client, message.channelId, "Give me a reason")
        const success = warning.editReason(args[0], args.slice(1).join(" "))
        if (!success) return send(client, message.channelId, "That case ID is not found.")
        return send(client, message.channelId, "Successfully changed reason!")
    }
}

addCommand(new Reason())
