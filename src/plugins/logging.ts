import { Bot, BotWithCache, config } from "@deps";
import { AllowedEvents } from "../interfaces/plugins.ts";

// deno-lint-ignore no-unused-vars no-explicit-any
export function logging(client: BotWithCache<Bot>, type: AllowedEvents, payload: any) {
    const log = config.plugins.logging
    if (!log.enable) return;
    if (log.events?.length! < 1) return;
}