import { Bot, BotWithCache, config } from "@deps";

export function autoRenameChannel(client: BotWithCache<Bot>) {
    const autoRenameChannel = config.plugins.autoRenameChannel
    if (!autoRenameChannel?.enable) return;
    setInterval(() => {
        const number = Math.floor(Math.random() * autoRenameChannel.variables.length)
        client.helpers.editChannel(BigInt(autoRenameChannel.channelID), {
            name: autoRenameChannel.nameToBeReplaced.replaceAll("$", autoRenameChannel.variables[number])
        })
    }, autoRenameChannel.durationInMinutes * 1000 * 60)
}