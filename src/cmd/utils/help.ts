import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, findCommand, globalCommand, JollyCommand } from "@classes/command.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";

class Help extends JollyCommand {

    private BLACKLIST_COMMAND: string[];

    constructor() {
        super("help", "utils", {
            description: "Show list of avaliable commands",
            usage: "[command]"
        })
        this.BLACKLIST_COMMAND = ["help", "eval", "unwarnall", "setlevel", "setxp"]
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>): Promise<void> {
        if (args[0]?.length > 0) {
            const cmd = findCommand(args[0])
            if (!cmd) return send(client, message.channelId, "Cannot find that command") as unknown as void;
            const cmdE = new JollyEmbed().command(cmd)
            send(client, message.channelId, cmdE)
            return;
        }
        const avatar = await avatarURL(client, client.id)
        const em = new JollyEmbed().setTitle("Help command").setThumb(avatar)
        const categories = Array.from(new Set(globalCommand.filter(e => !this.BLACKLIST_COMMAND.includes(e.name)).map(e => e.mod)))
            .sort()
        for (const name of categories) {
            em.addField(`★ ${name.toUpperCase()}`,
                globalCommand.filter(m => m.mod == name && !this.BLACKLIST_COMMAND.includes(m.name))
                    .map((_, m) => `\`${m}\``).join(", ")
            )
        }
        send(client, message.channelId, em.build())
    }
}

addCommand(new Help());
