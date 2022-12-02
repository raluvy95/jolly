import { Plugins } from "./plugins.ts";

export interface IJollyConfig {
    token: string,
    botID: string,
    description: string,
    owners: string[],
    guildID: string,
    prefixes: string[]
    playingStatus: string,
    autosentence: AutoSentence[],
    allowBotResponsingCommandChannelID: string[],
    plugins: Plugins
}

interface AutoSentence {
    action: "timeout" | "ban" | "kick",
    durationInMinutes: number,
    warnCount: number
}