import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { summonWebhook } from "@utils/webhook.ts";
import { avatarURL } from "../../utils/avatarURL.ts";

class SummonWebHook extends JollyCommand {
    constructor() {
        super("summon", "utils")
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const author = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
        return await summonWebhook(client, message.channelId, args.join(" ") || "Hello!", author.username, await avatarURL(client, author))
    }
}

addCommand(new SummonWebHook())