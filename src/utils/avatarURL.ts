import { config, iconBigintToHash, User } from "@deps";
import { JollyBot } from "@classes/client.ts";

export async function avatarURL(bot: JollyBot, user: bigint | User): Promise<string> {
    const u = typeof user == "bigint" ? await bot.cache.users.get(user) || await bot.helpers.getUser(user) : user;
    if (!u) throw new Error("Cannot find that user")
    return bot.helpers.getAvatarURL(u.id, u.discriminator, { avatar: u.avatar, format: "png" })
}

export async function iconURL(bot: JollyBot) {
    const s = await bot.cache.guilds.get(BigInt(config.guildID)) || await bot.helpers.getGuild(config.guildID)
    if (!s) throw new Error("What.")
    const hash = s.icon
    if (!hash) return null
    const hexHash = iconBigintToHash(hash)
    return `https://cdn.discordapp.com/icons/${s.id}/${hexHash}.png`
}