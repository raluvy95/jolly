import { AudioBot, config, Message } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

class Stop extends JollyCommand {
    constructor() {
        super("stop", "music", {
            aliases: ["fuckoff", "shutup", "end"],
            description: "Shutdown the song"
        })
    }

    override async run(message: Message, _args: string[], client: AudioBot<JollyBot>) {
        const player = client.helpers.getPlayer(BigInt(config.guildID))
        player.stop()
        player.clear()
        await client.helpers.leaveVoiceChannel(config.guildID)
        return await send(client, message.channelId, "Stopped and removed all queues!")
    }
}

addCommand(new Stop())