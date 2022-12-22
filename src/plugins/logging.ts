import { Bot, BotWithCache, config } from "@deps";
import { logToEmbed } from "@utils/logToEmbed.ts";
import { summonWebhook } from "@utils/webhook.ts";
import { JollyEvents } from "@classes/events.ts";

// deno-lint-ignore no-explicit-any
export async function loggingHandler(client: BotWithCache<Bot>, event: keyof JollyEvents, ...args: any) {
    const log = config.plugins.logging
    if (!log.enable) return
    for (const obj of log.events!) {
        if (obj.event == event) {
            const channelID = !obj.channelID ? log.globalChannelID! : obj.channelID
            const e = await logToEmbed(client, obj.event, ...args)
            if (!e || typeof e == "undefined") return;
            await summonWebhook(client, channelID, e, "Logging")
        }
    }
}
