import { createBot, enableCachePlugin, enableCacheSweepers, startBot, enablePermissionsPlugin } from "@deps";
import { Jolly } from "@classes/client.ts";
import { main } from "@utils/log.ts";

globalThis.addEventListener("unhandledrejection", (e) => {
    main.error("Unhandled rejection at:", e.promise,);
    e.preventDefault();
});

main.info("Starting Bot, this might take a while...");

const bbot = createBot(new Jolly());
const bot = enableCachePlugin(bbot);

enablePermissionsPlugin(bot);
enableCacheSweepers(bot);

await startBot(bot);