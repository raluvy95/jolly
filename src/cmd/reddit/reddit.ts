import { Bot, BotWithCache, CreateMessage, Embed, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";

class RedditCmd extends JollyCommand {

    private reddit: Reddit | undefined;

    constructor() {
        super("reddit", "reddit", {
            aliases: ["r"],
            description: "Get random post from specific subreddit",
            usage: "<subreddit>"
        })
    }

    // filter explict results
    private async checkSafety(message: Message, client: BotWithCache<Bot>): Promise<boolean> {
        if (!this.reddit) throw new Error("what.")

        const data = await this.reddit.toData()
        const channel = client.channels.get(message.channelId) ?? await client.helpers.getChannel(message.channelId)
        return !(!channel?.nsfw && data.over_18)
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>): unknown {
        if (!args[0]) return await send(client, message.channelId, "Please type which subreddit do you want to look for")
        this.reddit = new Reddit(args[0])
        const safe = await this.checkSafety(message, client)
        if (!safe) return await this.sendVoid(client, message.channelId, "The post you're looking for marked as NSFW. Try again")
        await send(client, message.channelId, await this.reddit.toEmbed(false, true))
    }
}

addCommand(new RedditCmd())
