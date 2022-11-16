import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level, XP_METHOD } from "@classes/level.ts"
class setXP extends JollyCommand {
    constructor() {
        super("setxp", "level", {
            permission: ["ADMINISTRATOR"]
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const userID = args[0]
        const value = args[1]
        level.setXP(message.channelId, client, userID, Number(value), XP_METHOD.SET)
        send(client, message.channelId, `<@${userID}>'s XP is set to **${value}**!`)
    }
}

addCommand(new setXP())
