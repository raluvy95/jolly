import { Bot, BotWithCache, config } from "@deps";
import { Reddit } from "@classes/reddit.ts";
import { send } from "@utils/send.ts";
export function autopost(client: BotWithCache<Bot>) {
    const autopost = config.plugins.autopost
    if (!autopost.enable) return;
    setInterval(async () => {
        const subredditPick = Math.floor(Math.random() * autopost.subredditToFollow.length)
        const sub = autopost.subredditToFollow[subredditPick]
        const r = new Reddit(sub)
        // deno-lint-ignore no-explicit-any
        let channel: any = client.channels.get(BigInt(autopost.channelID))
        if (!channel) {
            channel = client.helpers.getChannel(BigInt(autopost.channelID))
            if (!channel) return;
        }
        const em = await r.toEmbed(true, true)

        // sometimes it occurs HTTP Error 400 for no apparent reason
        // would be great if anyone really notices what's going on
        await send(client, channel.id, em).catch(() => { })
    }, autopost.intervalInMinutes * (1000 * 60))
}