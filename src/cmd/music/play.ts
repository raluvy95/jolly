import { AudioBot, Bot, BotWithCache, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
//import { JollyEmbed } from "@classes/embed.ts";

class Play extends JollyCommand {
    constructor() {
        super("play", "music")
    }

    override async run(message: Message, args: string[], client: AudioBot<BotWithCache<Bot>>) {
        if (!config.music.enable) {
            return send(client, message.channelId, "Music is disabled.")
        }

        const vc = client.guilds.get(BigInt(config.guildID))?.voiceStates.find((vc) => vc.userId === message.authorId)?.channelId;
        const botVc = client.guilds.get(BigInt(config.guildID))?.voiceStates.find((vc) => vc.userId === client.id)?.channelId;

        if (!vc) {
            return send(client, message.channelId, "Please join in vc")
        }
        if (!botVc) {
            await client.helpers.connectToVoiceChannel(config.guildID, vc, { selfDeaf: true })
        }

        const player = client.helpers.getPlayer(BigInt(config.guildID))
        player.pushQuery(args.join(" "))
    }
}

addCommand(new Play())