import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { starboardDB } from "../../classes/starboardDB.ts";

class PurgeStarBoard extends JollyCommand {
    constructor() {
        super("purgestarboard", "tools", {
            owner: true
        })
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        starboardDB.removeAll()
        return await send(client, message.channelId, "Cleared starboard caches!")
    }
}

addCommand(new PurgeStarBoard())