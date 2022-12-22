import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { level } from "@classes/level.ts";
import { findUser } from "@utils/find.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { progressBar, XPrequiredToLvlUP } from "@utils/levelutils.ts";


class Rank extends JollyCommand {
    constructor() {
        super("rank", "level", {
            aliases: ["xp", "level", "lvl"],
            description: "Get your current level or someone else's level",
            usage: "[member]"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        let userID: bigint = message.authorId
        if (args.length > 0) {
            const user = await findUser(client, args.join(" "), message)
            if (!user) return send(client, message.channelId, "That user is not found")
            userID = user.id
        }
        const rank = level.get(userID)
        if (!rank) return send(client, message.channelId, "That user hasn't started this coversation yet.")
        const reqXP = XPrequiredToLvlUP(rank.level)
        const nextUp = config.plugins.levelXP.rolesRewards.find(m => rank.level < m.level)
        let nextUpStr: string;
        if (!nextUp) {
            nextUpStr = `There are no ranks upcoming :(`
        } else {
            const left = nextUp.level - rank.level
            nextUpStr = `**${left} level${left == 1 ? '' : 's'}** left to reach <@&${nextUp.ID}>!`
        }
        const XPleft = reqXP - rank.xp
        nextUpStr += `\n**${XPleft} XP** left to reach level ${rank.level + 1}!`
        const percent = Math.floor(rank.xp / reqXP * 100)
        const e = new JollyEmbed()
            .setTitle("RANKS")
            .setThumb(await avatarURL(client, userID))
            .setDesc(nextUpStr)
            .addField("XP", String(rank.xp), true)
            .addField("Total XP", String(rank.totalxp), true)
            .addField("Level", String(rank.level), true)
            .addField("Progress Bar", `[${rank.xp}/${reqXP}] ${progressBar(rank.xp, reqXP)} (${percent}%)`)
            .setTime(0)
        return send(client, message.channelId, e.build())
    }
}

addCommand(new Rank())
