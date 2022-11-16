import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level, XP_METHOD } from "@classes/level.ts"
import { findUser } from "@utils/find.ts";

class setXP extends JollyCommand {
    constructor() {
        super("setxp", "level", {
            permission: ["ADMINISTRATOR"],
            usage: "<user> <value>",
            description: "Set an user's XP."
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (args.length < 1) return;
        const user = await findUser(client, args[0], message)
        if (!user) return send(client, message.channelId, "That user is not found")
        const userID = user.id
        const value = args[1]
        if (!value) return send(client, message.channelId, "How much XP do you give?")
        level.setXP(message.channelId, client, userID, Number(value), XP_METHOD.SET)
        return send(client, message.channelId, `Successfully set XP to ${value}`)
    }
}

addCommand(new setXP())
