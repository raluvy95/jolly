import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findMember } from "@utils/find.ts";
import { ms } from "https://deno.land/x/ms@v0.1.0/ms.ts";

class Ban extends JollyCommand {
    constructor() {
        super("tempban", "moderation", {
            permission: ["BAN_MEMBERS"],
            description: "Same thing as ban, now with time!",
            usage: "<member> <time> [reason]"
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const time = ms(args[1])
        const reason = args.slice(2).join(" ") + `  | Banned by ID: ${message.authorId}`
        if (!time) return send(client, message.channelId, "Please specific time.")
        const member = await findMember(client, args[0])
        if (!member) return send(client, message.channelId, "Cannot find that member")
        await client.helpers.banMember(config.guildID, member.id, {
            deleteMessageSeconds: 280,
            reason
        })
        setTimeout(async () => {
            try {
                await client.helpers.unbanMember(config.guildID, member.id)
            } catch { return }
        })
        return await send(client, message.channelId, `<@${member.id}> has been temporaly banned!`)
    }
}

addCommand(new Ban())