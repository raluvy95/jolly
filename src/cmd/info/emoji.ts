import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Emoji extends JollyCommand {
    constructor() {
        super("emoji", "info", {
            aliases: ["e", "emote"],
            description: "Display emoji as image"
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const arg = args[0];
        if (!arg) return send(client, message.channelId, "Please use `;emoji <Discord Emoji>`")
        if (!arg.startsWith("<")) return send(client, message.channelId, "Only Discord Emojis can input")
        let animated = false;
        if (arg.startsWith("<a:")) {
            animated = true;
        }
        const a = arg.replace(animated ? "<a:" : "<:", "");
        const c = a.replace(">", "");
        const [_name, id] = c.split(":");
        const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"
            }`;
        return send(client, message.channelId, url)
    }
}

addCommand(new Emoji())