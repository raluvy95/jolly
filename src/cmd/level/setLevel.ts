import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findUser } from "@utils/find.ts";
import { level } from "@classes/level.ts";

class SetLevel extends JollyCommand {
    constructor() {
        super("setlevel", "level", {
            permission: ["ADMINISTRATOR"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (args.length < 1) return;
        const mentionUser = message.mentionedUserIds
        const user = await findUser(client, mentionUser[0]?.toString() || args[0])
        if (!user) return send(client, message.channelId, "That user is not found")
        const userID = user.id
        const value = args[1]
        if (!value) return send(client, message.channelId, "How much level do you give?")
        level.setLevel(userID, Number(value))
        return send(client, message.channelId, `Successfully set level to ${value}`)
    }
}

addCommand(new SetLevel())