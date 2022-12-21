import { config, Message, MessageTypes } from "@deps";
import { prefix } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

export function selfping(client: JollyBot, message: Message) {
    const selfping = config.plugins.selfping
    if (!selfping.enable) return;
    if (message.mentionedUserIds.includes(client.id) && message.type == MessageTypes.Default) {
        send(client, message.channelId, !selfping.customMessage ? `I can listen you! Use \`${prefix}help\` for help!` : selfping.customMessage)
        return;
    }
}
