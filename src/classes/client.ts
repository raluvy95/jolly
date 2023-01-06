import { config, createBot, CreateBotOptions, enableAudioPlugin, enableCachePlugin, enableCacheSweepers, enablePermissionsPlugin, EventHandlers, GatewayIntents, Intents } from "@deps";
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
            | Intents.GuildVoiceStates | Intents.GuildMessageReactions | Intents.GuildBans;
        this.events = JollyEvent;
    }

}

main.info("Starting Bot, this might take a while...");

export const bot = enableAudioPlugin(enableCachePlugin(createBot(new Jolly())));

enablePermissionsPlugin(bot);
enableCacheSweepers(bot);