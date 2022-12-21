import { config, Message } from "@deps";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

export function ree(client: JollyBot, message: Message) {
    if (!config.plugins.ree) return;
    if (message.content.toLowerCase().startsWith("ree")) {
        send(client, message.channelId, "REEEEEEEEEEEEEEEEEEEE")
    }
} 
