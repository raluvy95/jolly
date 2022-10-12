import { Bot, BotWithCache, config, Message, Track } from "@deps";
import { addCommand, JollyCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { cluster } from "@classes/lavalink.ts";
import { JollyEmbed } from "@classes/embed.ts";

class Play extends JollyCommand {
    constructor() {
        super("play", "music")
    }

    override async run(message: Message, args: string[], client: BotWithCache<Bot>) {
        if (!config.music.enable) {
            return send(client, message.channelId, "Music is disabled.")
        }
        const vc = client.guilds.get(BigInt(config.guildID))?.voiceStates.find((vc) => vc.userId === message.authorId)?.channelId;
        const botVc = client.guilds.get(BigInt(config.guildID))?.voiceStates.find((vc) => vc.userId === client.id)?.channelId;

        let player = cluster.players.get(BigInt(config.guildID))
        /* check if the user in the player's vc. */
        if (player && player.channelId != vc) {
            return send(client, message.channelId, `Join <#${player.channelId}> please`);
        }

        const results = await cluster.rest.loadTracks(/^https?:\/\//.test(args.join(" "))
            ? args.join(" ")
            : `ytsearch: ${args.join(" ")}`);

        if (!vc) {
            return await send(client, message.channelId, "You need to join in voice channel first")
        }

        if (!botVc) {
            await client.helpers.connectToVoiceChannel(config.guildID, vc)
        }

        let tracks: Track[] = [], msg = "";
        switch (results.loadType) {
            case "LOAD_FAILED":
            case "NO_MATCHES":
                return send(client, message.channelId, "No matches found :(")
            case "PLAYLIST_LOADED":
                tracks = results.tracks;
                msg = `Queued playlist [**${results.playlistInfo.name}**](${args.join(" ")}), it has a total of **${tracks.length}** tracks.`;
                break
            // deno-lint-ignore no-fallthrough
            case "TRACK_LOADED":
            // deno-lint-ignore no-case-declarations
            case "SEARCH_RESULT":
                const [track] = results.tracks;
                tracks = [track];
                msg = `Queued [**${track.info.title}**](${track.info.uri})`;
                break;
        }

        if (!player?.connected) {
            player ??= cluster.createPlayer(BigInt(config.guildID));
            player.connect(vc, { deafen: true });
        }

        const e = new JollyEmbed()
            .setDesc(msg)
        await send(client, message.channelId, e.build())

        console.log(player)

        if (!player.playing && !player.paused) {
            await player.play(tracks[0])
        }
    }
}

addCommand(new Play())