import { Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findUser } from "@utils/find.ts";
import { warning } from "@classes/warning.ts";
import { warnEvent } from "@classes/events.ts";
import { JollyBot } from "@classes/client.ts";

class Warn extends JollyCommand {
    constructor() {
        super("warn", "moderation", {
            permission: ["KICK_MEMBERS"],
            usage: "<user> [reason]",
            description: "Warn an user"
        })
    }

    override async run(message: Message, args: string[], client: JollyBot) {
        const author = await client.cache.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
        if (!author) throw new Error("what.")
        if (!args[0]) return send(client, message.channelId, "Missing arguments")
        const user = await findUser(client, args[0], message)
        if (!user) return send(client, message.channelId, "That user is not found")
        if (user.id == message.authorId) return send(client, message.channelId, "Don't warn yourself, please.")
        const warnData = warning.push(user.id, user.username, args.slice(1).join(" ") || "No reason", message.authorId, author.username)
        send(client, message.channelId, `Sucessfully warned **${user.username + "#" + user.discriminator}** !`)
        warnEvent.emit("warnTrigger", client, warnData, user);
        return
    }
}

addCommand(new Warn())
