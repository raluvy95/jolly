import { config, Cluster } from "@deps";
import { lavalink } from "@utils/log.ts";
import { bot } from "@classes/client.ts";

export const cluster = new Cluster({
    nodes: [
        {
            id: "main",
            ...config.music.lavalink_config
        }
    ],
    sendGatewayPayload: (id, payload) => {
        const shard = bot.guilds.get(id)?.shardId
        if (shard != null) {
            const little_shard = bot.gateway.manager.shards.get(shard)
            if (little_shard == null) return;
            little_shard.send(payload)
        }
    }
})

cluster.on("nodeConnect", () => lavalink.info("Connected!"))
cluster.on("nodeDisconnect", (code, reason, reconnect) => {
    lavalink.info(`Disconnected! [${code}] Reconnect? ${reconnect}\nReason: ${reason}`)
})
cluster.on("nodeDebug", msg => lavalink.debug(msg))
cluster.on("nodeError", err => lavalink.error(err))
if (config.music.enable) {
    //cluster.connect(BigInt(config.botID))
    cluster.init(BigInt(config.botID))
} else {
    lavalink.info("I will not launch because music plugin is disabled.")
}