import { bot } from "@classes/client.ts";
import { main } from "@utils/log.ts";

await bot.helpers.createGlobalApplicationCommand({
    name: "jolly",
    description: "Show information about slash command status"
})

main.info("Successfully register slash command!")