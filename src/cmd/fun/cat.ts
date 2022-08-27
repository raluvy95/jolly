import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Cat extends JollyCommand {
    constructor() {
        super("cat", "fun", {
            aliases: ["kitty"],
            description: "meow meow"
        })
    }

    override run(message: Message, _args: string[], client: BotWithCache<Bot>): void {
        fetch("https://aws.random.cat/meow").then(async r => {
            const j = await r.json()
            send(client, message.channelId, j.file)
        })

    }

}

addCommand(new Cat())