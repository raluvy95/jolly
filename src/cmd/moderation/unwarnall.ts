import { Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { warning } from "@classes/warning.ts";
import { findUser } from "@utils/find.ts";
import { JollyBot } from "@classes/client.ts";

class UnWarnAll extends JollyCommand {
    constructor() {
        super("unwarnall", "moderation", {
            owner: true
        })
    }

    override async run(message: Message, args: string[], client: JollyBot) {
        if (!args[0]) return send(client, message.channelId, "Who do you want to remove all warnings of?")
        const mentionUser = message.mentionedUserIds
        const user = await findUser(client, mentionUser[0]?.toString() || args[0])
        if (!user) return send(client, message.channelId, "That user can't be found")
        warning.removeAll(user.id)
        return send(client, message.channelId, "Successfully removed all warnings!")
    }
}

addCommand(new UnWarnAll())
