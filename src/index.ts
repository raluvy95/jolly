import { startBot, Bot } from "@deps";
import { bot } from "@classes/client.ts";
import { main } from "@utils/log.ts";

globalThis.addEventListener("unhandledrejection", (e) => {
    main.error("Unhandled rejection at:", e.promise,);
    e.preventDefault();
});

globalThis.addEventListener('uncaughtException', (e) => {
    main.error("Unhandled exception at:", e)
    e.preventDefault()
})

await startBot(bot as Bot);
