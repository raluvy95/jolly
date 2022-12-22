import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand, prefix } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findUser } from "../../utils/find.ts";
import { level } from "../../classes/level.ts";

class Remove extends JollyCommand {
    constructor() {
        super("removeuser", "level", {
            owner: true,
            usage: "[--force] <user>",
            description: "Remove an user from level. This will remove their level and XP"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!args.length) return send(client, message.channelId, `Argument is required. Use \`${prefix}removeuser [--force] <user>\``)
        if (args[0] == "--force") {
            const anotherArg = args.slice(1).join(" ")
            level.remove(anotherArg)
            return send(client, message.channelId, `Successfully removed ${anotherArg} from level!`)
        }
        const user = await findUser(client, args.join(" "), message)
        if (!user) return send(client, message.channelId, "Cannot find that user.")
        level.remove(user.id)
        return send(client, message.channelId, `Successfully removed **<@${user.id}>** from level!`)
    }
}

addCommand(new Remove())