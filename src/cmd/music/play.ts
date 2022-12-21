import { AudioBot, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyBot } from "../../classes/client.ts";

class Play extends JollyCommand {
    constructor() {
        super("play", "music", {
            aliases: ["p", "song", "music"],
            description: "Play songs from YouTube",
            usage: "<query>"
        })
    }

    override async run(message: Message, args: string[], client: AudioBot<JollyBot>) {
        const vc = (await client.cache.guilds.get(BigInt(config.guildID)))?.voiceStates.find((vc) => vc.userId === message.authorId)?.channelId;
        const botVc = (await client.cache.guilds.get(BigInt(config.guildID)))?.voiceStates.find((vc) => vc.userId === client.id)?.channelId;

        if (!vc) {
            return send(client, message.channelId, "Please join in vc")
        }
        if (!botVc) {
            await client.helpers.connectToVoiceChannel(config.guildID, vc, { selfDeaf: true })
        }

        const player = client.helpers.getPlayer(BigInt(config.guildID))
        const audio = await player.pushQuery(args.join(" "))
        send(client, message.channelId, `**Queued:** ${audio[0].title}`)
    }
}

addCommand(new Play())