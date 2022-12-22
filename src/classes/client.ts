import { Collection, config, createBot, CreateBotOptions, DiscordGuildMemberUpdate, DiscordVoiceState, enableAudioPlugin, enableCachePlugin, enableCacheSweepers, enablePermissionsPlugin, EventHandlers, GatewayIntents, Intents, VoiceState, BotWithCache, Bot, Member, User } from "@deps";
import { JollyEvent, JollyEvents } from "@classes/events.ts";
import { main } from "@utils/log.ts";
import { loggingHandler } from "@plugins/logging.ts";


export const JollyVersion = "0.6.4"

export class Jolly implements CreateBotOptions {

    public token: string;
    public botID: bigint;
    public events?: Partial<EventHandlers>;
    public intents: GatewayIntents;

    constructor() {
        this.token = config.token;
        this.botID = BigInt(config.botID);
        this.intents = Intents.GuildMembers | Intents.MessageContent
            | Intents.GuildMessages | Intents.DirectMessages
            | Intents.GuildVoiceStates | Intents.GuildMessageReactions
            | Intents.Guilds | Intents.GuildBans | Intents.GuildEmojis;
        this.events = JollyEvent as JollyEvents & EventHandlers;
    }

}


main.info("Starting Bot, this might take a while...");

export const bot = enableAudioPlugin(enableCachePlugin(createBot(new Jolly())));
const { GUILD_MEMBER_UPDATE, VOICE_STATE_UPDATE } = bot.handlers;


(bot.events as JollyEvents).guildMemberUpdateCache = (client: BotWithCache<Bot>, member: Member, oldMember: Member, user: User) => {
    loggingHandler(client, "guildMemberUpdateCache", member, oldMember, user)
},
    (bot.events as JollyEvents).voiceStateUpdateCache = (client: BotWithCache<Bot>, vs: VoiceState, oldvs: VoiceState) => {
        loggingHandler(client, "voiceStateUpdateCache", vs, oldvs)
    },

    bot.handlers.GUILD_MEMBER_UPDATE = (_, data, shardId) => {
        const payload = data.d as DiscordGuildMemberUpdate;
        const user = bot.transformers.user(bot, payload.user)
        const member = bot.transformers.member(bot, payload, BigInt(payload.guild_id), BigInt(payload.user.id));
        const oldMember = bot.members.get(BigInt(payload.user.id));
        if (!oldMember) {
            bot.members.set(member.id, member);
            return
        }
        bot.members.set(member.id, member);

        (bot.events as JollyEvents).guildMemberUpdateCache(bot, member, oldMember!, user)
        GUILD_MEMBER_UPDATE(bot, data, shardId);
    };

const cacheVS = new Collection<string, VoiceState>()

bot.handlers.VOICE_STATE_UPDATE = (_, data, shardId) => {
    const payload = data.d as DiscordVoiceState
    const vs = bot.transformers.voiceState(bot, {
        voiceState: payload,
        guildId: BigInt(payload.guild_id || 0n)
    })

    const oldVS = cacheVS.get(vs.sessionId)
    cacheVS.set(vs.sessionId, vs)
    if (!oldVS) {
        return
    }
    (bot.events as JollyEvents).voiceStateUpdateCache(bot, vs, oldVS)
    VOICE_STATE_UPDATE(_, data, shardId)
}

enablePermissionsPlugin(bot);
enableCacheSweepers(bot);