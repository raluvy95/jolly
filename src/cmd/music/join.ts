import { config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

class Join extends JollyCommand {
    constructor() {
        super("join", "music", {
            description: "Join in a voice. Only useful if the bot failed to join in vc"
        })
    }

    override async run(message: Message, _args: string[], client: JollyBot) {
        const vc = (await client.cache.guilds.get(BigInt(config.guildID)))?.voiceStates.find((vc) => vc.userId === message.authorId)?.channelId;
        const botVc = (await client.cache.guilds.get(BigInt(config.guildID)))?.voiceStates.find((vc) => vc.userId === client.id)?.channelId;

        if (!vc) {
            return send(client, message.channelId, "Please join in vc")
        }
        if (!botVc) {
            await client.helpers.connectToVoiceChannel(config.guildID, vc, { selfDeaf: true })
            send(client, message.channelId, `I joined in <#${vc}>!`)
            return
        } else {
            return send(client, message.channelId, "I'm already on vc!")
        }
    }
}

addCommand(new Join())