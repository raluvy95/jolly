import { Bot, BotWithCache, ChannelTypes, config, Message } from "@deps";

export function autoCreateChannel(client: BotWithCache<Bot>, message: Message) {
    const autocreate = config.plugins.autoCreateChannel
    if (!autocreate.enable) return;
    const content = message.content
    const matched = content.match(/#[a-z0-9-]{0,100}/g)
    if (matched) {
        const name = matched[0].replace("#", '')
        if (!name || name.length < 1) return;
        client.helpers.createChannel(config.guildID, {
            name: name,
            type: ChannelTypes.GuildText,
            parentId: autocreate.categoryID
        })
        return
    }
}
