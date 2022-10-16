import { Bot, BotWithCache, config, iconBigintToHash, User } from "@deps";

export async function avatarURL(bot: BotWithCache<Bot>, user: bigint | User): Promise<string> {
    const u = typeof user == "bigint" ? bot.users.get(user) || await bot.helpers.getUser(user) : user;
    if (!u) throw new Error("Cannot find that user")
    return bot.helpers.getAvatarURL(u.id, u.discriminator, { avatar: u.avatar, format: "png" })
}

export async function iconURL(bot: BotWithCache<Bot>) {
    const s = bot.guilds.get(BigInt(config.guildID)) || await bot.helpers.getGuild(config.guildID)
    if (!s) throw new Error("What.")
    const hash = s.icon
    if (!hash) return null
    const hexHash = iconBigintToHash(hash)
    return `https://cdn.discordapp.com/icons/${s.id}/${hexHash}.png`
}