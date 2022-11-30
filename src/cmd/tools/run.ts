import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand, prefix } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { TIO } from "../../../lib/min-tio.js";
import { IDS } from "../../../lib/id.ts";
import { JollyEmbed } from "@classes/embed.ts";

interface Unknown {
    [key: string]: string;
}

class Run extends JollyCommand {
    constructor() {
        super("run", "tools")
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const err = "Please input your code (requires to have formatted codeblock). This is how codeblock should look like: \n```js\nconsole.log(\"hello world\")\n```"
        if (!args.length) return send(client, message.channelId, err)
        if (args[0].toLowerCase().startsWith("lang")) {
            const e = new JollyEmbed()
                .setTitle(`Avaliable languages`)
                .setDesc("There are more than 660+ languages right now! View list of languages on https://tio.run/#")
                .build()
            return send(client, message.channelId, e)
        }
        if (args[0].indexOf("```") == -1) return send(client, message.channelId, err)
        let lang = args[0].split("\n")[0].replace("```", "")
        for (const key in IDS) {
            if (key.toLowerCase().includes(lang)) {
                lang = (IDS as Unknown)[key]
                break
            }
        }
        const code1 = args.join(" ").split("\n").slice(1).join("\n")
        const code = code1.slice(0, code1.lastIndexOf("```"))
        const r = await TIO.run(code, '', lang)
        if (r[0].startsWith("The language")) {
            return send(client, message.channelId, `Type \`${prefix}run lang\` to show list of languages avaliable`)
        }
        const codeblock = r[0]?.length > 0 && r.length == 3 ? `\`\`\`${r[0]}\`\`\`\n` : "No output\n"
        const error = r[1]?.startsWith("/home/runner/.code.tio") || r[1]?.startsWith(".code.tio") || r[1]?.includes(".code.tio") ? `\`\`\`\n${r[1].split("\n").slice(0, 5).join("\n")}\n\`\`\`` : ""
        const time = r[1]?.startsWith("\nReal") ? r[1].split("\n").join(" | ") : ""
        const e = new JollyEmbed()
            .setTitle(`Code results - ${lang}`)
            .setDesc(codeblock + error)
            .setFooter(time)
        send(client, message.channelId, e.build())
    }
}

addCommand(new Run())