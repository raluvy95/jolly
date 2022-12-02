import { Bot, BotWithCache, config, Message } from "@deps";
import { send } from "@utils/send.ts";
import { level, XP_METHOD } from "@classes/level.ts";

export const bumpReminder = (client: BotWithCache<Bot>, message: Message) => {
    if (config.plugins.bump.enable && message.interaction?.name == "bump"
        && message.authorId === 302050872383242240n) {
        let msg = "I will remind you to bump again in two hours!"
        if (config.plugins.levelXP.enable && config.plugins.levelXP.rewardWhenBump) {
            level.setXP(message.channelId, client, message.interaction?.user.id, 100, XP_METHOD.ADD)
            msg = "Thank you for bumping this server! **You earn 100 XP**!\n" + msg
        }
        send(client, message.channelId, msg)
        setTimeout(() => {
            return send(client, message.channelId, {
                content: "Hey <@&$ID>, reminder to `/bump` again!".replace("$ID", config.plugins.bump.roleID!),
                allowedMentions: {
                    roles: [BigInt(config.plugins.bump.roleID!)]
                }
            });
        }, 7200000)
        return
    }
}
