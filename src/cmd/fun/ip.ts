import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { isIP } from "https://deno.land/x/isIP@1.0.0/mod.ts";

class IP extends JollyCommand {
    constructor() {
        super("ip", "fun", {
            description: "Get some information about specific IP",
            usage: "<IP>",
            cooldown: 5
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!args[0]) return send(client, message.channelId, "Give me the IP.")
        if (isIP(args[0]) == 0) return send(client, message.channelId, "That's not an IP")
        const jj = await fetch(`https://ipinfo.io/${args[0]}/geo`)
        const info = await jj.json()
        const e = new JollyEmbed()
            .setTitle(`IP: ${info.ip}`)
            .setDesc(`City: ${info.city}\nRegion: ${info.region}\nCountry: ${info.country}\nLocation: ${info.loc}\nTimezone: ${info.timezone}\nPostal: ${info.postal}`)
        send(client, message.channelId, e.build())
    }
}

addCommand(new IP())
