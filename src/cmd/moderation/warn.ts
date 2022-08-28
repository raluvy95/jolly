import { Bot, BotWithCache, Message, User } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { findUser } from "@utils/find.ts";
import { warning } from "@classes/database.ts";
import { warnEvent } from "../../classes/events.ts";

class Warn extends JollyCommand {
    constructor() {
        super("warn", "moderation", {
            permission: ["KICK_MEMBERS"]
        })
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        const author = client.users.get(message.authorId) || await client.helpers.getUser(message.authorId)
        if (!author) throw new Error("what.")
        if (!args[0]) return send(client, message.channelId, "Missing arguments")
        const mentionUser = message.mentionedUserIds
        let user: User | undefined
        if (mentionUser.length >= 1) {
            user = await findUser(client, mentionUser[0].toString())
        } else {
            user = await findUser(client, args[0])
        }
        if (!user) return send(client, message.channelId, "That user is not found")
        if (user.id == message.authorId) return send(client, message.channelId, "Don't warn yourself, please.")
        const warnData = warning.push(user.id, user.username, args.slice(1).join(" ") || "No reason", message.authorId, author.username)
        await send(client, message.channelId, `Sucessfully warned **${user.username + "#" + user.discriminator}** !`)
        await warnEvent.emit("warnTrigger", client, warnData, user);
        return
    }
}

addCommand(new Warn())