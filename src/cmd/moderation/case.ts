import { Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { warning } from "@classes/warning.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { JollyBot } from "@classes/client.ts";

class Case extends JollyCommand {
    constructor() {
        super("case", "moderation", {
            description: "Show a warn info by case ID",
            usage: "<case id>",
            aliases: ["caseid", "showcase", "showwarn", "warnshow", "warninfo"]
        })
    }

    override run(message: Message, args: string[], client: JollyBot) {
        if (!args[0]) return send(client, message.channelId, "Missing Case ID")
        const warn = warning.getByCaseID(args[0])
        if (!warn) return send(client, message.channelId, "Cannot find that warning!")
        const em = new JollyEmbed()
            .warn(warn)
        return send(client, message.channelId, em)
    }
}

addCommand(new Case())
