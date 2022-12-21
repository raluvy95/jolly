import { Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { sniper } from "@classes/snipe.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";

class Snipe extends JollyCommand {
    constructor() {
        super("snipe", "tools")
    }

    override async run(message: Message, _args: string[], client: JollyBot) {
        const snip = sniper.getMsg()
        if (!snip || snip?.channelid != message.channelId) return send(client, message.channelId, "There's no deleted message yet :(")
        const e = new JollyEmbed()
            .setAuthor(snip.author.name, await avatarURL(client, snip.author.id))
            .setDesc(snip.message)
        await send(client, message.channelId, { content: "Got snipe'd", embeds: e.build() })
    }
}

addCommand(new Snipe())