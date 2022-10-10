import { config, createBot, CreateBotOptions, enableCachePlugin, enableCacheSweepers, enablePermissionsPlugin, EventHandlers, GatewayIntents, Intents } from "@deps";
import { JollyEvent } from "@classes/events.ts";
import { main } from "@utils/log.ts";

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
            | Intents.GuildVoiceStates;
        this.events = JollyEvent;
    }

}

globalThis.addEventListener("unhandledrejection", (e) => {
    main.error("Unhandled rejection at:", e.promise,);
    e.preventDefault();
});

main.info("Starting Bot, this might take a while...");

export const bot = enableCachePlugin(createBot(new Jolly()));

enablePermissionsPlugin(bot);
enableCacheSweepers(bot);