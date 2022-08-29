import { Bot, CreateMessage, Embed, Message } from "@deps";
import { EmptyError } from "@const/errors.ts";

export function send(bot: Bot, channelId: bigint, content: string | CreateMessage | Embed[]): Promise<Message> {
  if ((typeof content == "string" || Array.isArray(content)) && !content.length) throw new EmptyError("The content cannot be empty")
  content = typeof content == "object" && !Array.isArray(content) ? content : {
      embeds: Array.isArray(content) ? content : [],
      content: typeof content == "string" ? content : undefined
  }
  
  return bot.helpers.sendMessage(channelId, content)
}
