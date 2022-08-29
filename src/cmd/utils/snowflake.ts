import { Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { createdAt } from "@utils/snowflake.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";

class Snowflake extends JollyCommand {
    constructor() {
        super("snowflake", "utils", {
            aliases: ["snow"],
            description: "Get a creation data from ID"
        })
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>): void {
        if (!args[0]) { send(client, message.channelId, "Give me random ID lol"); return; }
        const snow = args[0]
        try {
            const data = createdAt(BigInt(snow))
            const e = new JollyEmbed()
            e.setTitle("Snowflake ID")
                .setDesc(`ID: **${snow}**\nDate: **${data}**`)
                .setThumb("https://cdn-icons-png.flaticon.com/512/2411/2411812.png")
                .setColor(COLORS.CYAN)
            send(client, message.channelId, data)
        } catch {
            send(client, message.channelId, "Invalid ID")
        }
    }
}

addCommand(new Snowflake())