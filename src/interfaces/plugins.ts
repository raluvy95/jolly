import { CreateMessage, Embed } from "@deps";
import { JollyEmbed } from "@classes/embed.ts"

export interface PluginBase {
    enable: boolean
}

export interface Plugins {
    reactionRole: ReactionRolePlug
    showContentOnMessageLink: boolean
    bump: Bump
    ree: boolean
    sudo: boolean
    selfping: SelfPing
    nicknameOnJoin: NicknameOnJoin
    autoPublish: AutoPublish
    autorole: Autorole
    autopost: Autopost
    autoCreateChannel: AutoCreateChannel
    ghostPing: boolean
    greeting: Greeting
    autoRenameChannel: AutoRenameChannel
    levelXP: LevelXP
    funfact: FunFact
    clockChannel: ClockChannel
    rss: RSS
    logging: Logging,
    music: Music,
    starboard: Starboard
}

interface ReactionRolePlug extends PluginBase {
    reactions?: ReactionRoleObj[]
}

interface ReactionRoleObj {
    channelID: string,
    messageID: string,
    type: "one" | "multiple",
    removeReactionAfterTrigger: boolean,
    roleEmojis: RoleEmojiObj[]
}

interface RoleEmojiObj {
    roleID: string,
    emoji: string
}

interface Bump extends PluginBase {
    roleID?: string
}

interface SelfPing extends PluginBase {
    customMessage?: string
}

interface NicknameOnJoin extends PluginBase {
    nickname?: string
}

interface AutoPublish extends PluginBase {
    botOnlyChannelID?: string[]
    channelID?: string[]
}

interface Autorole extends PluginBase {
    userRoleID?: string,
    botRoleID?: string
}

interface AutopostPost {
    name: string,
    channelID: string,
    subredditToFollow: string[]
    intervalInMinutes: number
}

interface Autopost extends PluginBase {
    posts?: AutopostPost[]
}

interface AutoCreateChannel extends PluginBase {
    categoryID?: string
}

interface AutoRenameChannel extends PluginBase {
    channelID?: string,
    variables?: string[],
    nameToBeReplaced?: string,
    durationInMinutes?: number
}

interface RolesRewards {
    ID: string,
    level: number
}

interface LevelXP extends PluginBase {
    rolesRewards?: RolesRewards[],
    levelUP?: {
        channelID: string,
        voiceChannelID?: string,
        customMessage: string
    }
    rewardWhenBump?: boolean,
    ignoreCooldownRoles?: string[],
    ignoreXPChannels?: string[],
    multiplyXP?: number,
    minXP?: number,
    maxXP?: number,
    gainXPonVC?: boolean
}

interface FunFact extends PluginBase {
    source?: string,
    intervalInMin?: number,
    channelID?: string
}

interface ClockChannel extends PluginBase {
    categoryID?: string,
    channelID?: string,
    timezone?: string,
    intervalInMinutes?: number,
    channelName?: string
}

interface RSS extends PluginBase {
    feedsURL?: string[],
    channelID?: string,
    customMessage?: string
}

export type AllowedEvents = "threadCreate" | "threadDelete"
    | "threadUpdate" | "guildMemberAdd" | "guildMemberRemove"
    | "guildMemberUpdate" | "messageDelete" | "messageDeleteBulk"
    | "channelCreate" | "channelDelete" | "roleCreate" | "roleDelete"
    | "messageUpdate"

interface Logging extends PluginBase {
    warnLogChannelID?: string,
    channelID?: string,
    events?: Array<AllowedEvents>
}

// deno-lint-ignore no-empty-interface
interface Music extends PluginBase {

}

interface Starboard extends PluginBase {
    channelID?: string
    customEmoji?: string
    requiredStarCount?: number,
    ignoreReactionYourself?: boolean
}

export interface ContextMessage {
    embed: JollyEmbed
    author: string,
    authorAvatarURL: string,
    mention: string,
    memberCount: number,
    serverName: string
}

export type FuncContextMessage = (ctx: ContextMessage) => string | CreateMessage | Embed[]

interface Greeting extends PluginBase {
    join?: {
        enable: boolean,
        channelID: string
        customMessage: FuncContextMessage | string
    },
    leave?: {
        enable: boolean,
        channelID: string
        customMessage: FuncContextMessage | string
    },
    ban?: {
        enable: boolean,
        channelID: string
        customMessage: FuncContextMessage | string
    }
}