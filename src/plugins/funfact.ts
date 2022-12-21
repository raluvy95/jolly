import { config } from "@deps";
import { main } from "@utils/log.ts";
import { send } from "@utils/send.ts";
import { JollyBot } from "@classes/client.ts";

type FunfactContent = string[];

export function funfact(client: JollyBot) {
    const funfact = config.plugins.funfact
    if (!funfact.enable) return;
    setInterval(async () => {
        const contents = await fetch(funfact.source!).then(m => m.json()).catch(e => {
            main.info("Invalid source url:", e, "\nPlease check documentation - https://github.com/raluvy95/jolly/wiki/Source-for-Fun-fact")
        }) as FunfactContent;
        if (contents.length < 1) return;
        const choiced = contents[Math.floor(Math.random() * contents.length)]
        send(client, funfact.channelID!, `**Fun fact:** ${choiced}`)
    }, (!funfact.intervalInMin ? 250 : funfact.intervalInMin) * 1000 * 60)
}