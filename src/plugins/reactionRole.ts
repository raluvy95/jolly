import { Bot, BotWithCache, config } from "@deps";
import { ReactionRmPayload } from "../interfaces/reactionpayload.ts";

function getEmojiName(emoji: string) {
    if (emoji.startsWith("<")) {
        const [_, name, _id] = emoji.split(":")
        emoji = name
    }
    return emoji
}

export async function reaction(client: BotWithCache<Bot>, payload: ReactionRmPayload, type: "add" | "rm") {
    if (payload.userId == client.id) return;
    const reactionRoleConf = config.plugins.reactionRole
    if (!reactionRoleConf.enable) return;
    if (reactionRoleConf.reactions.length < 1) return;
    const currentReaction = reactionRoleConf.reactions.find(m => BigInt(m.channelID) == payload.channelId && BigInt(m.messageID) == payload.messageId)
    if (!currentReaction) return;
    const currentRole = currentReaction.roleEmojis.find(m => getEmojiName(m.emoji) == payload.emoji.name)
    if (!currentRole) return;
    const member = client.members.get(payload.userId) || await client.helpers.getMember(config.guildID, payload.userId)
    if (!member) return;
    switch (type) {
        case "add": {
            if (member.roles.some(m => m == BigInt(currentRole.roleID))) return;
            const already_exist = member.roles.some(m => currentReaction.roleEmojis.findIndex(n => BigInt(n.roleID) == m) != -1)
            if (currentReaction.type == "one" && already_exist) {
                const roleToTake = member.roles.find(m => currentReaction.roleEmojis.findIndex(n => BigInt(n.roleID) == m) != -1)
                if (!roleToTake) throw new Error("what.")
                await client.helpers.removeRole(config.guildID, payload.userId, roleToTake, "Reaction Role | Used single choice method")
            }
            await client.helpers.addRole(config.guildID, payload.userId, currentRole.roleID, "Reaction Role")
            if (currentReaction.removeReactionAfterTrigger) {
                await client.helpers.deleteUserReaction(payload.channelId, payload.messageId, payload.userId, currentRole.emoji)
            }
            break
        }
        case "rm": {
            if (!member.roles.some(m => m == BigInt(currentRole.roleID)) || currentReaction.removeReactionAfterTrigger) return;
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