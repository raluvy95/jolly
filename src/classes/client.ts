import { Bot, BotWithCache, Channel, config, createBot, CreateBotOptions, enableAudioPlugin, enableCachePlugin, EventHandlers, GatewayIntents, Guild, Intents, Member, Message, Role, User } from "@deps";
import { JollyEvent } from "@classes/events.ts";
import { main } from "@utils/log.ts";

export const JollyVersion = "0.6.3"

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
            | Intents.Guilds | Intents.GuildBans | Intents.GuildEmojis | Intents.GuildVoiceStates;
        this.events = JollyEvent;
    }

}

main.info("Starting Bot, this might take a while...");

const basebot = createBot(new Jolly())

const cache = enableCachePlugin(basebot, {
    cacheInMemory: {
        default: true
    }
})

export const bot = enableAudioPlugin(cache);


export type JollyBot = BotWithCache<{
    guild: Guild,
    user: User,
    channel: Channel,
    member: Member,
    message: Message,
    role: Role
}, Bot>