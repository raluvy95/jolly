import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";


class Ping extends JollyCommand {
    constructor() {
        super("ping", "utils", {
            aliases: ["pong"],
            description: "Check if the bot responses"
        })
    }

    override run(message: Message, _args: string[], client: BotWithCache<Bot>): void {
        send(client, message.channelId, `Pong! ${Date.now() - message.timestamp}ms`)
    }

}

addCommand(new Ping())