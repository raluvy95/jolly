import { Bot, BotWithCache, User } from "@deps";

export async function avatarURL(bot: BotWithCache<Bot>, user: bigint | User): Promise<string> {
    const boi = typeof user == "bigint" ? bot.users.get(user) || await bot.helpers.getUser(user) : user;
    if (!u) throw new Error("Cannot find that user")
    return bot.helpers.avatarURL(user.id, user.discriminator, { avatar: user.avatar, format: "png" })
}
