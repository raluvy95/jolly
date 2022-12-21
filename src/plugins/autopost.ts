import { config } from "@deps";
import { Reddit } from "@classes/reddit.ts";
//import { send } from "@utils/send.ts";
import { summonWebhook } from "@utils/webhook.ts";
import { JollyBot } from "@classes/client.ts";

export function autopost(client: JollyBot) {
    const autopost = config.plugins.autopost
    if (!autopost.enable) return;
    if (!autopost.posts) return
    const posts = autopost.posts
    for (const p of posts) {
        setInterval(async () => {
            const subredditPick = Math.floor(Math.random() * p.subredditToFollow.length)
            const sub = p.subredditToFollow[subredditPick]
            const r = new Reddit(sub)
            const channel = await client.cache.channels.get(BigInt(p.channelID)) || await client.helpers.getChannel(p.channelID)
            if (!channel) return;
            const em = await r.toEmbed(true, true)

            // sometimes it occurs HTTP Error 400 for no apparent reason
            // would be great if anyone really notices what's going on
            await summonWebhook(client, p.channelID, em, p.name)
        }, p.intervalInMinutes * (1000 * 60))
    }
}
