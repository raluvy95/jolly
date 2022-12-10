import { ActionRow, Bot, BotWithCache, ButtonStyles, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class RemoveAll extends JollyCommand {
    private buttonBullshit: ActionRow[]

    constructor() {
        super("removeall", "level", {
            owner: true
        })
        this.buttonBullshit = [{
            type: 1,
            components: [{
                customId: "accept",
                label: "Yes",
                style: ButtonStyles.Danger,
                type: 2
            }, {
                customId: "deny",
                label: "No",
                style: ButtonStyles.Primary,
                type: 2
            }]
        }]
    }

    override run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        return send(client, message.channelId,
            {
                content: "Do you REALLY want to remove **ALL** users recorded in a database?",
                components: this.buttonBullshit
            })
    }
}

addCommand(new RemoveAll())