import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { uptime } from "@utils/uptime.ts";
import { JollyVersion } from "../../classes/client.ts";

class BotInfo extends JollyCommand {
    constructor() {
        super("botinfo", "info", {
            aliases: ["clientinfo", "bot"],
            description: "Information about this bot with some stats"
        })
    }

    private bytesToMB(bytes: number): string {
        const kb = bytes / 1024
        const mb = kb / 1024
        return mb.toFixed(0) + " MB"
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>): Promise<void> {
        const discordeno_version = client.constants.DISCORDENO_VERSION
        const deno_version = Deno.version
        const user = client.users.get(client.id) ?? await client.helpers.getUser(client.id)
        if (!user) throw new Error("what.")

        const memory = Deno.memoryUsage()
        const sMemory = `**RSS:** ${this.bytesToMB(memory.rss)}\n**External:** ${this.bytesToMB(memory.external)}\n**Heap Total:** ${this.bytesToMB(memory.heapTotal)}\n**Heap Used** ${this.bytesToMB(memory.heapUsed)}`

        const up = uptime()

        const shell = Deno.run({
            cmd: ["git", "log", "--pretty=format:\"%h\"", "-1"],
            stdout: 'piped'
        })

        let lastGitOutput = ''

        // silly users could remove .git folder lol
        // so I added if it's avaliable
        if ((await shell.status()).code == 0) {
            lastGitOutput = `(${new TextDecoder().decode(await shell.output())})`
        }

        const em = new JollyEmbed()
            .setTitle("Information about the bot")
            .setDesc(config.description)
            .addField("Runtime", `Deno v${deno_version.deno}`, true)
            .addField("Language", `TypeScript v${deno_version.typescript}`, true)
            .addField("Library", `Discordeno v${discordeno_version}`, true)
            .addField("Jolly Version", `${JollyVersion} ${lastGitOutput}`, true)
            .addField("Uptime", up, true)
            .addField("Memory", sMemory, true)
            .setThumb(await avatarURL(client, user))
            .build()
        send(client, message.channelId, em)
    }
}

addCommand(new BotInfo())
