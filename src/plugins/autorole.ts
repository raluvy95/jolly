import { Bot, BotWithCache, config, Member, User } from "@deps";

export function autorole(client: BotWithCache<Bot>, member: Member, user: User): Promise<void> {
    const autorole = config.plugins.autorole
    if (!autorole.enable) return;
    try {
        if (user.toggles.bot) {
            return client.helpers.addRole(BigInt(config.guildID), member.id, BigInt(autorole.botRoleID))
        } else if (!member.toggles.pending) {
            return client.helpers.addRole(BigInt(config.guildID), member.id, BigInt(autorole.userRoleID))
        }
    } catch { return; }
}
