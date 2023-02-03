import { BigString, Bot, BotWithCache, CreateMessage, Embed, Webhook } from "@deps";
import { contentToObj } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";

export async function summonWebhook(client: BotWithCache<Bot>, channelId: BigString, content: string | CreateMessage | Embed[], name?: string, avatar?: string) {
    const webhook = await client.helpers.getChannelWebhooks(channelId)
    let webhookClient: Webhook | undefined;
    if (webhook.size > 0) {
        for (const [_id, web] of webhook) {
            if (!web.token) continue
            webhookClient = web
            break
        }
    }
    if (!webhookClient) {
        webhookClient = await client.helpers.createWebhook(channelId, {
            name: "Jolly Webhook",
            avatar: await avatarURL(client, client.id)
        })
    }
    if (!webhookClient?.token) {
        throw new Error("what.")
    }
    const parsedContent = typeof content == "string" || Array.isArray(content) ? contentToObj(content) : content
    return await client.helpers.executeWebhook(webhookClient.id, webhookClient.token, {
        ...parsedContent,
        username: name || "Jolly Webhook",
        avatarUrl: avatar || await avatarURL(client, client.id)
    })
}