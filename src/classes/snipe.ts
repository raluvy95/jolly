import { config } from "../../config.ts";
import { Bot, Message } from "../../deps.ts";
import { BotWithCache } from "../../deps.ts";
import { lastMessage } from "../interfaces/snipe.ts"

class Sniper {
    private lastMessage: lastMessage | null

    constructor() {
        this.lastMessage = null
    }

    setMsg(newMsg: lastMessage) {
        this.lastMessage = newMsg
        return
    }

    getMsg() {
        return this.lastMessage
    }
}

export const sniper = new Sniper()

export async function sniperHandler(client: BotWithCache<Bot>, message: Message) {
    if (!config.plugins.sniper) return
    const author = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
    const result = {
        author: {
            name: author.username + "#" + author.discriminator,
            id: author.id
        },
        channelid: message.channelId,
        message: message.content.length > 2000 ? message.content.slice(0, 2000) + "..." : message.content
    } as lastMessage
    sniper.setMsg(result)
}