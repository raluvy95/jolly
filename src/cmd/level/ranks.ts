import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { iconURL } from "@utils/avatarURL.ts";

class Ranks extends JollyCommand {
    constructor() {
        super("ranks", "level")
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        const ranks = config.plugins.levelXP.rolesRewards
        if (ranks.length < 1) return send(client, message.channelId, "Roles rewards is empty")
        const e = new JollyEmbed()
            .setTitle(`Roles rewards [${ranks.length}]`)
            .setThumb(await iconURL(client))
        let desc = ''
        for (const rank of ranks) {
            desc += `<@&${rank.ID}> - Level ${rank.level}\n`
        }
        e.setDesc(desc)
        return await send(client, message.channelId, e.build())
    }
}

addCommand(new Ranks())