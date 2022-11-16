import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findUser } from "@utils/find.ts";
import { level } from "@classes/level.ts";

class SetLevel extends JollyCommand {
    constructor() {
        super("setlevel", "level", {
            permission: ["ADMINISTRATOR"],
            usage: "<user> <value>",
            description: "Set an user's level."
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (args.length < 1) return;
        const user = await findUser(client, args[0], message)
        if (!user) return send(client, message.channelId, "That user is not found")
        const userID = user.id
        const value = args[1]
        if (!value) return send(client, message.channelId, "How much level do you give?")
        level.setLevel(userID, Number(value))
        return send(client, message.channelId, `Successfully set level to ${value}`)
    }
}

addCommand(new SetLevel())