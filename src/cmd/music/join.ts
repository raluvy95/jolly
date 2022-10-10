import { Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Join extends JollyCommand {
    constructor() {
        super("join", "music")
    }

    override async run(message: Message, _args: string[], client: BotWithCache<Bot>) {
        if (!config.music.enable) {
            return send(client, message.channelId, "Music is disabled.")
        }
        const vc = client.guilds.get(BigInt(config.guildID))?.voiceStates.find((vc) => vc.userId === message.authorId)?.channelId;
        if (!vc) {
            return await send(client, message.channelId, "You need to join in voice channel first")
        }

        const type = client.channels.get(vc)?.type
        console.log(type)
        try {
            await client.helpers.connectToVoiceChannel(config.guildID, vc)
            send(client, message.channelId, `Connected to <#${vc}>!`)
        } catch {
            return await send(client, message.channelId, "Oops! Can't join!")
        }
    }
}

addCommand(new Join())