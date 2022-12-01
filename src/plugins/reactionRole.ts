import { Bot, BotWithCache, config } from "@deps";
import { ReactionRmPayload } from "../interfaces/reactionpayload.ts";

export async function reaction(client: BotWithCache<Bot>, payload: ReactionRmPayload, type: "add" | "rm") {
    if (payload.userId == client.id) return;
    const reactionRoleConf = config.plugins.reactionRole
    if (!reactionRoleConf.enable) return;
    if (reactionRoleConf.reactions.length < 1) return;
    const currentReaction = reactionRoleConf.reactions.find(m => BigInt(m.channelID) == payload.channelId && BigInt(m.messageID) == payload.messageId)
    if (!currentReaction) return;
    const currentRole = currentReaction.roleEmojis.find(m => m.emoji == payload.emoji.name)
    if (!currentRole) return;
    const member = client.members.get(payload.userId) || await client.helpers.getMember(config.guildID, payload.userId)
    if (!member) return;
    switch (type) {
        case "add": {
            if (member.roles.some(m => m == BigInt(currentRole.roleID))) return;
            await client.helpers.addRole(config.guildID, payload.userId, currentRole.roleID, "Reaction Role")
            break
        }
        case "rm": {
            if (!member.roles.some(m => m == BigInt(currentRole.roleID))) return;
            await client.helpers.removeRole(config.guildID, payload.userId, currentRole.roleID, "Reaction Role")
            break
        }
    }
}


/*
Initialize reaction (such as automatic adding reaction if there's no reaction)
*/
export async function reactionInit(client: BotWithCache<Bot>) {
    const reactionRoleConf = config.plugins.reactionRole
    if (!reactionRoleConf.enable) return;
    if (reactionRoleConf.reactions.length < 1) return;
    for (const instances of reactionRoleConf.reactions) {
        const emojis = []
        for (const { emoji } of instances.roleEmojis) {
            emojis.push(emoji)
        }
        await client.helpers.addReactions(instances.channelID, instances.messageID, emojis, true)
    }
}