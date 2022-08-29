import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";
import { main } from "@utils/log.ts";

class Meme extends JollyCommand {
    private readonly subredditMeme: string[];

    constructor() {
        super("meme", "reddit", {
            description: "Get random memes"
        })
        this.subredditMeme = ["dankmemes", "meme", "memes"]
    }

    override async run(message: Message, _: string[], client: BotWithCache<Bot>): Promise<void> {
        try {
            const subPick = this.subredditMeme[Math.floor(Math.random() * this.subredditMeme.length)]
            const reddit = new Reddit(subPick, "hot")
            const e = await reddit.toEmbed(true)
            send(client, message.channelId, e)
        } catch (e) {
            main.error(e)
        }
    }
}

addCommand(new Meme())