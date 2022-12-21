import { config, Message } from "@deps";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

export function sudo(client: JollyBot, message: Message) {
    if (!config.plugins.sudo) return;
    if (message.content.startsWith("sudo rm -rf")) {
        const arg = message.content.slice(12)
        return send(client, message.channelId, `I'm going to remove the folder \`${arg}\`...`).then(r => {
            setTimeout(() => {
                client.helpers.editMessage(message.channelId, r.id, {
                    content: `\`${arg}\` has been deleted!`
                })
            }, 3000)
        })
    } else if (message.content.startsWith("sudo shutdown")) {
        return send(client, message.channelId, "Shutting down...")
    }
}
