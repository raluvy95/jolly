import { BigString, Bot, BotWithCache, CreateMessage, Embed, Message } from "@deps";
import { EmptyError } from "@const/errors.ts";

export function contentToObj(content: string | Embed[]): CreateMessage {
  if ((typeof content == "string" || Array.isArray(content)) && !content.length) throw new EmptyError("The content cannot be empty")
  const r = typeof content == "object" && !Array.isArray(content) ? content : {
    embeds: Array.isArray(content) ? content : [],
    content: typeof content == "string" ? content : undefined
  }
  return r
}

export function send(bot: BotWithCache<Bot>, channelId: BigString, content: string | CreateMessage | Embed[]): Promise<Message> {
  content = typeof content == "string" || Array.isArray(content) ? contentToObj(content) : content

  return bot.helpers.sendMessage(channelId, content)
}
