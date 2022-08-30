import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";

class BotInfo extends JollyCommand {
    constructor() {
        super("botinfo", "info", {
            aliases: ["clientinfo", "bot"]
        })
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>): Promise<void> {
        const discordeno_version = client.constants.DISCORDENO_VERSION
        const deno_version = Deno.version
        const user = client.users.get(client.id) ?? await client.helpers.getUser(client.id)
        if (!user) throw new Error("what.")
        const em = new JollyEmbed()
            .setTitle("Information about the bot")
            .setDesc("CatNowBot - codename **Jolly**\nA Discord bot with necessary functions to maintain this server.")
            .addField("Runtime", `Deno v${deno_version.deno}`, true)
            .addField("Language", `TypeScript v${deno_version.typescript}`, true)
            .addField("Library", `Discordeno v${discordeno_version}`, true)
            .setThumb(await avatarURL(client, user))
            .build()
        send(client, message.channelId, em)
    }
}

addCommand(new BotInfo())
