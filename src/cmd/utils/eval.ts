import { ActionRow, Bot, BotWithCache, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Eval extends JollyCommand {
    private evaled: unknown | string;
    private buttonBullshit: ActionRow[];

    constructor() {
        super("eval", "utils", {
            owner: true
        })
        this.buttonBullshit = [{
            type: 1,
            components: [{
                customId: "delete",
                label: "Delete",
                style: 1,
                type: 2
            }]
        }]
    }

    private clean(text: string): string {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }

    private code(text: string): string {
        return "```ts\n" + text + "\n```"
    }

    override run(message: Message, args: string[], client: BotWithCache<Bot>) {
        try {
            const code = args.join(" ");
            this.evaled = eval(code);
            if (typeof this.evaled !== "string") {
                this.evaled = Deno.inspect(this.evaled);
            }
            const output = this.clean(this.evaled as string)
            if (output.length > 1990) {
                send(client, message.channelId, "The output is too long! Check logs!")
                return
            } else {
                send(client, message.channelId, {
                    content: this.code(String(output)),
                    components: this.buttonBullshit
                })
            }
        } catch (err) {
            send(client, message.channelId, {
                content: this.code(String(!err.stack ? err : err.stack.replace(/\((.*)\)/g, ''))),
                components: this.buttonBullshit
            })
        }
    }
}

addCommand(new Eval())
