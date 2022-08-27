import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { warning } from "../../classes/database.ts";

class Reason extends JollyCommand {
    constructor() {
        super("reason", "moderation", {
            permission: ["KICK_MEMBERS"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!args[0]) return await send(client, message.channelId, "Give me a reason")
        const success = warning.editReason(args[0], args.slice(0).join(" "))
        if (!success) return await send(client, message.channelId, "That case ID is not found.")
        return await send(client, message.channelId, "Successfully changed reason!")
    }
}

addCommand(new Reason())