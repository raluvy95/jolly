import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level } from "@classes/level.ts";
import { JollyEmbed } from "@classes/embed.ts";

class Leaderboard extends JollyCommand {
    constructor() {
        super("leaderboard", "level", {
            aliases: ["lb", "ranks", "levels"]
        })
    }

    override async run(message: Message, _: string[], client: BotWithCache<Bot>) {
        const list = level.getAll().slice(0, 10)
        const guildHash = (await client.helpers.getGuild(config.guildID)).icon
        const icon_url = `https://cdn.discordapp.com/icons/${message.guildId}/${guildHash}.png`
        const e = new JollyEmbed()
            .setTitle("Leaderboard")
            .setThumb(icon_url)
        let result = '';
        let position = 0;
        function award(position: number) {
            switch (position) {
                case 1:
                    return '🥇'
                case 2:
                    return '🥈'
                case 3:
                    return '🥉'
                default:
                    return position
            }
        }
        for (const l of list) {
            position++
            result += `${award(position)} - <@${l.userid}>\n**Level** ${l.level} | **Total XP** ${l.totalxp.toLocaleString()} | **XP** ${l.xp.toLocaleString()}\n`
        }
        e.setDesc(result)
        send(client, message.channelId, e.build())
    }
}

addCommand(new Leaderboard())