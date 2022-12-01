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

    override run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        const err = "There's something went wrong with cat. No cat for you :("
        try {
            fetch("https://aws.random.cat/meow").then(async r => {
                try {
                    const j = await r.json()
                    send(client, message.channelId, j.file)
                } catch {
                    send(client, message.channelId, err)
                }
            })
        } catch {
            return send(client, message.channelId, err)
        }
    }
}

addCommand(new Cat())