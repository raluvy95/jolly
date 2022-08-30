import { Bot, BotWithCache, config, Message } from "@deps";
import { send } from "@utils/send.ts";

export function ree(client: BotWithCache<Bot>, message: Message) {
    if (!config.plugins.ree) return;
    if (message.content.startsWith("ree")) {
        send(client, message.channelId, "REEEEEEEEEEEEEEEEEEEE")
    }
} 
