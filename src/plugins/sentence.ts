import { bold, config, Member } from "@deps";
import { main } from "@utils/log.ts";
import { JollyBot } from "@classes/client.ts";

type Action = "ban" | "kick" | "timeout"

interface Sentence {
    action: Action
    durationInMinutes: number
    warnCount: number
}

export function sentence(client: JollyBot, member: Member, warnCount: number) {
    if (config.autosentence.length < 1) return;
    const foundSentence = config.autosentence.find(m => m.warnCount == warnCount) as Sentence | undefined
    if (!foundSentence) return

    function minuteToMS(min: number): number {
        return min * 60 * 1000
    }
    const datee = new Date()
    switch (foundSentence.action) {
        case "timeout":
            client.helpers.editMember(config.guildID, member.id, {
                communicationDisabledUntil: datee.setMinutes(datee.getMinutes() + foundSentence.durationInMinutes)
            })
            break
        case "kick":
            client.helpers.kickMember(config.guildID, member.id, `Reached ${warnCount} warnings`)
            break
        case "ban":
            client.helpers.banMember(config.guildID, member.id, {
                reason: `Reached ${warnCount} warnings`,
                deleteMessageSeconds: 86400
            })
            if (foundSentence.durationInMinutes > 0) {
                setTimeout(() => {
                    client.helpers.unbanMember(config.guildID, member.id)
                }, minuteToMS(foundSentence.durationInMinutes))
            }
            break
    }
    main.info(`${bold(`ID ${member.id}`)} was sentenced with ${foundSentence.action}`)
}
