import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, findCommand, globalCommand, JollyCommand } from "@classes/command.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";

class Help extends JollyCommand {

    private BLACKLIST_COMMAND: string[];

    constructor() {
        super("help", "utils")
        this.BLACKLIST_COMMAND = ["help", "eval", "unwarnall"]
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>): Promise<void> {
        if (args[0]?.length > 0) {
            const arg = args[0]
            const cmd = findCommand(arg)
            if (!cmd) return await send(client, message.channelId, "Cannot find that command") as unknown as void;
            const cmdE = new JollyEmbed().command(cmd)
            send(client, message.channelId, cmdE)
            return;
        }
        const em = new JollyEmbed()
        const sortedDir = [...Deno.readDirSync("./src/cmd")].sort((a, b) => a.name.localeCompare(b.name))
        for (const { name } of sortedDir) {
            em.addField(`🞇 ${name.toUpperCase()}`,
                globalCommand.filter(m => m.mod == name && !this.BLACKLIST_COMMAND.includes(m.name))
                    .map((_, m) => `\`${m}\``).join(", ")
            )
        }
        em.setTitle("Help command")
        const avatar = await avatarURL(client, client.id)
        em.setThumb(avatar)
        await send(client, message.channelId, em.build())
    }
}

addCommand(new Help());