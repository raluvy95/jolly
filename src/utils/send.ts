import { Bot, BotWithCache, CreateMessage, Embed, Message } from "@deps";
import { EmptyError } from "@const/errors.ts";

export function send(bot: Bot | BotWithCache<Bot>, channelId: bigint, content: string | CreateMessage | Embed[]): Promise<Message> {
    if (typeof content == "string" && content.length < 1) {
        throw new EmptyError("The content cannot be empty.")
    }
    else if (content instanceof Array) {
        content = {
            embeds: content
        } as CreateMessage
    }
    return bot.helpers.sendMessage(channelId, typeof content == "string" ? { content: content } : content)
}