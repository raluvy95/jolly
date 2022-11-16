import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level } from "../../classes/level.ts";

class RemoveAll extends JollyCommand {
    constructor() {
        super("removeall", "level", {
            owner: true
        })
    }

    override run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        level.removeAll()
        return send(client, message.channelId, "Purged everything!")
    }
}

addCommand(new RemoveAll())