import { config } from "@deps";
import { editChannel } from "@utils/editChannel.ts";
import { JollyBot } from "@classes/client.ts";

export function autoRenameChannel(client: JollyBot) {
    const autoRenameChannel = config.plugins.autoRenameChannel
    if (!autoRenameChannel?.enable) return;
    if (!autoRenameChannel?.variables && !autoRenameChannel.variables
        && autoRenameChannel.variables == undefined) return;
    setInterval(() => {
        const number = Math.floor(Math.random() * autoRenameChannel.variables?.length!)
        editChannel(client, autoRenameChannel?.channelID!, {
            name: autoRenameChannel.nameToBeReplaced!.replaceAll("$", autoRenameChannel.variables![number])
        })
    }, autoRenameChannel.durationInMinutes! * 1000 * 60)
}