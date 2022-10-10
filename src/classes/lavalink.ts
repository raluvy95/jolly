import { config, Node } from "@deps";
import { lavalink } from "@utils/log.ts";
import { ConnectionInfo } from "https://deno.land/x/lavadeno@3.2.3/mod.ts";
import { bot } from "@classes/client.ts";

export const node = new Node({
    connection: config.music.lavalink_config as ConnectionInfo,
    sendGatewayPayload: (id, payload) => {
        const shard = bot.guilds.get(id)?.shardId
        if (shard != null) bot.gateway.manager.shards.get(shard)?.send(payload)
    }
})

node.on("connect", () => lavalink.info("Connected!"))
node.on("disconnect", (code, reason, reconnect) => {
    lavalink.info(`Disconnected! [${code}] Reconnect? ${reconnect}\nReason: ${reason}`)
})
node.on("debug", msg => lavalink.debug(msg))
node.on("error", err => lavalink.error(err))
if (config.music.enable) {
    node.connect(BigInt(config.botID))
} else {
    lavalink.info("I will not launch because music plugin is disabled.")
}