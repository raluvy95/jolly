import { Bot, BotWithCache, User } from "@deps";

export async function avatarURL(bot: BotWithCache<Bot>, user: bigint | User): Promise<string> {
    const u = typeof user == "bigint" ? bot.users.get(user) || await bot.helpers.getUser(user) : user;
    if (!u) throw new Error("Cannot find that user")
    return bot.helpers.getAvatarURL(u.id, u.discriminator, { avatar: u.avatar, format: "png" })
}
