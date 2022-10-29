import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level } from "@classes/level.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { iconURL } from "@utils/avatarURL.ts";

class Leaderboard extends JollyCommand {
    constructor() {
        super("leaderboard", "level", {
            aliases: ["lb", "levels"],
            description: "Show list of most active members"
        })
    }

    override async run(message: Message, _: string[], client: BotWithCache<Bot>) {
        const tops = level.getAll()
        if (tops.length < 1) {
            return send(client, message.channelId, "The leaderboard is empty")
        }
        const list = tops.slice(0, 10)
        const icon_url = await iconURL(client)
        const e = new JollyEmbed()
            .setTitle("Leaderboard")
        if (icon_url) {
            e.setThumb(icon_url)
        }
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
        let mesg: string;
        const currentRank = tops.findIndex(t => t.userid == message.authorId.toString())
        if (currentRank == -1) {
            mesg = "You just ran this command"
        } else {
            const currentRankDetails = tops[currentRank]
            mesg = `Rank: ${award(currentRank + 1)} | **Level** ${currentRankDetails.level}`
        }
        e.addField("Your rank", mesg)
        e.setDesc(result)
        send(client, message.channelId, e.build())
    }
}

addCommand(new Leaderboard())