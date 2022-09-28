import { createBot, enableCachePlugin, enableCacheSweepers, startBot, enablePermissionsPlugin, Bot } from "@deps";
import { Jolly } from "@classes/client.ts";
import { main } from "@utils/log.ts";

globalThis.addEventListener("unhandledrejection", (e) => {
    main.error("Unhandled rejection at:", e.promise,);
    e.preventDefault();
});

main.info("Starting Bot, this might take a while...");

const bot = enableCachePlugin(createBot(new Jolly()));

enablePermissionsPlugin(bot);
enableCacheSweepers(bot);

await startBot(bot as Bot);
