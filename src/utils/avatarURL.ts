import { Bot, BotWithCache, User } from "@deps";

export async function avatarURL(bot: BotWithCache<Bot>, user: bigint | User): Promise<string> {
    if (typeof user == "bigint") {
        let u = bot.users.get(user)
        if (!u) {
            u = await bot.helpers.getUser(user)
            if (!u) throw new Error("Cannot find that user")
        }
        return bot.helpers.avatarURL(user, u.discriminator, { avatar: u.avatar, format: "png" })
    }
    return bot.helpers.avatarURL(user.id, user.discriminator, { avatar: user.avatar, format: "png" })
}
