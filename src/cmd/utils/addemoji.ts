import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand, prefix } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class AddEmoji extends JollyCommand {
    constructor() {
        super("addemoji", "utils", {
            aliases: ["aemoji"],
            permission: ["MANAGE_EMOJIS_AND_STICKERS"],
            usage: "<Emoji or URL> <name if URL is input>"
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        function isEmote(a: string[]) {
            return a[0].startsWith("<a:") || a[0].startsWith("<:");
        }
        function isURL(a: string[]) {
            return a[0].startsWith("https://") || a[0].startsWith("https://");
        }
        if (!args[0])
            return send(client, message.channelId,
                `Please use \`${prefix}addemoji <emoji or URL> <name if URL is input>\``);
        if (isEmote(args)) {
            let animated = false;
            if (args[0].startsWith("<a:")) animated = true;
            const emote = animated
                ? args[0].replace("<a:", "").replace(">", "")
                : args[0].replace("<:", "").replace(">", "");
            const [name, id] = emote.split(":");
            const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
            client.helpers.createEmoji(config.guildID, {
                name: name,
                image: url
            }).then(_e => {
                send(client, message.channelId, `I added that to this guild!`);
            }).catch(e => send(client, message.channelId, `It looks like I got an error!\n${e}`))
        } else if (isURL(args)) {
            if (!args[1])
                return send(client, message.channelId,
                    "Please tell what name is that cuz I can't create new emote without any name"
                );
            client.helpers.createEmoji(config.guildID, { image: args[0], name: args.slice(1).join("_") }).then(_e => {
                send(client, message.channelId, `I added that to this guild!`);
            }).catch(e => send(client, message.channelId, `I got an error!\n${e}`))
        } else { return send(client, message.channelId, "It looks like your result is invalid") }
    }
}

addCommand(new AddEmoji())