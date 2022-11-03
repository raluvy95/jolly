import { Bot, BotWithCache, Message } from "@deps";
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

    override async run(message: Message, args: string[], client: BotWithCache<Bot>): Promise<void> {
        if (!args[0]) return send(client, message.channelId, "Please type which subreddit do you want to look for") as unknown as void
        this.reddit = new Reddit(args[0])
        let safe;
        try {
            safe = await this.checkSafety(message, client)
        } catch (e) {
            send(client, message.channelId, `There's something went wrong with Reddit API: ${e}`)
            return;
        }
        if (!safe) return send(client, message.channelId, "The post you're looking for marked as NSFW. Try again") as unknown as void
        send(client, message.channelId, await this.reddit.toEmbed(false, true))
    }
}

addCommand(new RedditCmd())
