import { AudioBot, Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyEmbed } from "../../classes/embed.ts";

class Queues extends JollyCommand {
    constructor() {
        super("queues", "music", {
            aliases: ["nowplaying", "np", "q"]
        })
    }

    override run(message: Message, _args: string[], client: AudioBot<BotWithCache<Bot>>) {
        const player = client.helpers.getPlayer(BigInt(config.guildID))
        const currentSong = player.current()
        const upcomingSongs = player.upcoming()
        if (!currentSong) {
            return send(client, message.channelId, "There are no songs :(")
        }
        const e = new JollyEmbed()
            .setTitle("Queues")
            .setDesc(`**Now playing**: ${currentSong.title}\n**Position:** ${Number(currentSong.id) + 1}`)
        if (upcomingSongs.length >= 1) {
            e.addField("Upcoming", upcomingSongs.map(m => `[${Number(m.id) + 1}] **${m.title}**`).join("\n"))
        }
        return send(client, message.channelId, e.build())
    }
}

addCommand(new Queues())