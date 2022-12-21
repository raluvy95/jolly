import { config, Member, User } from "@deps";
import { JollyBot } from "@classes/client.ts";

export function autorole(client: JollyBot, member: Member, user: User) {
    const autorole = config.plugins.autorole
    if (!autorole.enable) return;
    try {
        if (user.toggles.bot) {
            return client.helpers.addRole(config.guildID, member.id, autorole.botRoleID!)
        } else if (!member.toggles.pending) {
            return client.helpers.addRole(config.guildID, member.id, autorole.userRoleID!)
        }
    } catch { return; }
}
