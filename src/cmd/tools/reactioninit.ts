import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { reactionInit } from "../../plugins/reactionRole.ts";

class ReactionInit extends JollyCommand {
    constructor() {
        super("reactioninit", "tools", {
            owner: true,
            aliases: [
                "reactionupdate"
            ]
        })
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        const msg = await send(client, message.channelId, "Initializing/updating reaction role, please be patient...")
        await reactionInit(client)
        return await client.helpers.editMessage(msg.channelId, msg.id, {
            content: "Initialized/update reaction role!"
        })
    }
}

addCommand(new ReactionInit())