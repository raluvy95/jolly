import { config, CreateBotOptions, EventHandlers, GatewayIntents, Intents } from "@deps";
import { JollyEvent } from "@classes/events.ts";

export class Jolly implements CreateBotOptions {

    public token: string;
    public botID: bigint;
    public events?: Partial<EventHandlers>;
    public intents: GatewayIntents;

    constructor() {
        this.token = config.token;
        this.botID = BigInt(config.botID);
        this.intents = Intents.GuildMembers | Intents.MessageContent
            | Intents.GuildMessages | Intents.DirectMessages;
        this.events = JollyEvent
    }

}