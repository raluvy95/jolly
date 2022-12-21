import { Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { uptime } from "@utils/uptime.ts";
import { JollyBot } from "@classes/client.ts";

class Uptime extends JollyCommand {
    constructor() {
        super("uptime", "info", {
            description: "Show how long has the bot been running for"
        })
    }

    override run(message: Message, _: string[], client: JollyBot) {
        const up = uptime()
        return send(client, message.channelId, up)
    }
}

addCommand(new Uptime())