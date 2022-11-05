import { Bot, BotWithCache, ChannelTypes, config, OverwriteTypes } from "@deps";
import { dateToString } from "@utils/dateToString.ts";

function clockEmoji(date: Date) {
    const hour = date.toLocaleTimeString('en-US',
        { hour12: true, hour: 'numeric' }
    ).replace(/\s(AM|PM)$/, '');
    const numToEmoji = {
        '12': '🕛',
        '0': '🕛',
        '1': '🕐',
        '2': '🕑',
        '3': '🕒',
        '4': '🕓',
        '5': '🕔',
        '6': '🕕',
        '7': '🕖',
        '8': '🕗',
        '9': '🕘',
        '10': '🕙',
        '11': '🕚'
    }
    // deno-lint-ignore no-explicit-any
    return (numToEmoji as any)[hour] as string
}

export async function clock(client: BotWithCache<Bot>) {
    const d = new Date()
    const conf = config.plugins.clockChannel
    if (!conf.enable) return;
    const c = dateToString(d, {
        clockOnly: true,
        includesTimezone: true,
        timezone: conf.timezone
    })
    const chName = conf.channelName.replace("$TIME", c).replace("$EMOJI", clockEmoji(d))
    if (conf.channelID == "0") {
        const { id } = await client.helpers.createChannel(config.guildID, {
            name: chName,
            parentId: conf.categoryID == "0" ? undefined : conf.categoryID,
            type: ChannelTypes.GuildVoice,
            permissionOverwrites: [{
                deny: ["CONNECT"],
                id: BigInt(config.guildID),
                type: OverwriteTypes.Role
            }]
        })
        config.plugins.clockChannel.channelID = String(id)
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(config, null, 4));
        Deno.writeFileSync("config.json", data)
    }
    client.helpers.editChannel(BigInt(conf.channelID), {
        name: chName
    })
    setInterval(() => {
        client.helpers.editChannel(BigInt(conf.channelID), {
            name: chName
        })
    }, 1000 * 60 * conf.intervalInMinutes)
}