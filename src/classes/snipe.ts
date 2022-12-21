import { config, Message } from "@deps";
import { lastMessage } from "../interfaces/snipe.ts"
import { JollyBot } from "./client.ts";

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

export async function sniperHandler(client: JollyBot, message: Message) {
    if (!config.plugins.sniper) return
    const author = await client.cache.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
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