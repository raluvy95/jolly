import { Bot, BotWithCache, config, parseFeed } from "@deps";
import { main } from "@utils/log.ts";
import { summonWebhook } from "@utils/webhook.ts";

interface RSS {
    url: string,
    id: string
}

async function getCache() {
    // just to create if it doesn't exist.
    const file = await Deno.open("./lastrsscache.json", {
        create: true,
        write: true
    })
    file.close()
    try {
        const text = await Deno.readTextFile("./lastrsscache.json")
        return JSON.parse(text) as Array<RSS>
    } catch {
        return []
    }
}

async function itExist(url: string) {
    const c = await getCache()
    const exist = c.findIndex(r => r.url == url) != -1
    return { bool: exist, value: exist ? c.find(r => r.url == url) : null }
}

async function updateId(url: string, id: string) {
    const exist = await itExist(url)
    const c = await getCache()
    let result: string;
    if (!exist.bool) {
        c.push({
            url: url,
            id: id
        })
        result = JSON.stringify(c)
    } else {
        c[c.findIndex(r => r.url == url)].id = id
        result = JSON.stringify(c)
    }
    await Deno.writeTextFile("./lastrsscache.json", result)
}

export function RSS(client: BotWithCache<Bot>) {
    const rss = config.plugins.rss
    if (!rss?.enable) return;

    const customMsg = "📰 | **$title**\n\n$url" || rss.customMessage
    for (const feed of rss.feedsURL!) {
        setInterval(async () => {
            const checkStatus = await fetch(feed)
            if (checkStatus.status != 200) {
                main.warn(`${feed} returns ${checkStatus.status}`)
                return
            }
            const txt = await checkStatus.text()
            const { entries } = await parseFeed(txt)
            const lastPost = entries[0]
            const exist = await itExist(feed)
            if (exist.bool) {
                const currentPost = exist.value
                if (!currentPost) throw new Error("what.")
                if (currentPost.id == lastPost.id) return;
            }
            const title = lastPost.title?.value || lastPost["dc:title"] || lastPost["media:title"]?.value || "unknown title"
            const url = lastPost.links[0].href || "unknown URL"
            const con = customMsg.replace("$title", title).replace("$url", url)
            await summonWebhook(client, rss.channelID!, con, "RSS Feed")
            await updateId(feed, lastPost.id)

        }, 1000 * 60 * 25)
    }
}

/*
ATOM EXAMPLE:
{
  id: "tag:theregister.com,2005:story224771",
  published: undefined,
  publishedRaw: undefined,
  updated: 2022-11-17T20:13:34.000Z,
  updatedRaw: "2022-11-17T20:13:34Z",
  title: {
    value: "Koch-funded group sues US state agency for installing 'spyware' on 1m Android devices",
    type: "html"
  },
  description: {
    value: "<h4>Class-action lawsuit seeks $1 in nominal damages</h4> <p>The Massachusetts Department of Public ...",
    type: "html"
  },
  links: [
    {
      href: "https://go.theregister.com/feed/www.theregister.com/2022/11/17/kochfunded_group_sues_us_state/",
      rel: "alternate",
      type: "text/html"
    }
  ],
  attachments: [],
  author: {
    email: undefined,
    name: "Jessica Lyons Hardcastle",
    uri: "https://search.theregister.com/?author=Jessica%20Lyons%20Hardcastle"
  }
}

RSS2 EXAMPLE:
{
  id: "https://www.phoronix.com/review/linux-2022-raptorlake",
  title: {
    value: 'Testing Six Different Linux Distributions On The Intel Core i9 13900K "Raptor Lake"',
    type: undefined
  },
  description: {
    value: "For those wondering about the out-of-the-box performance of different modern Linux distributions whe...",
    type: undefined
  },
  comments: undefined,
  published: 2022-11-17T19:42:02.000Z,
  publishedRaw: "Thu, 17 Nov 2022 14:42:02 -0500",
  updated: 2022-11-17T19:42:02.000Z,
  updatedRaw: "Thu, 17 Nov 2022 14:42:02 -0500",
  links: [ { href: "https://www.phoronix.com/review/linux-2022-raptorlake" } ],
  categories: undefined,
  contributors: undefined
}


RSS EXAMPLE:

{
  "dc:creator": [ "Ankush Das" ],
  "wfw:commentrss": { value: "https://itsfoss.com/authenticator/feed/" },
  "slash:comments": { value: "4" },
  id: "https://itsfoss.com/?p=103681",
  title: {
    value: "Authenticator: A Simple Open-Source App to Replace Authy on Linux",
    type: undefined
  },
  description: {
    value: "A free and open-source app for two-factor authentication codes on the Linux desktops.",
    type: undefined
  },
  comments: "https://itsfoss.com/authenticator/#comments",
  published: 2022-11-17T12:11:10.000Z,
  publishedRaw: "Thu, 17 Nov 2022 12:11:10 +0000",
  updated: 2022-11-17T12:11:10.000Z,
  updatedRaw: "Thu, 17 Nov 2022 12:11:10 +0000",
  author: { email: undefined, name: "Ankush Das", uri: undefined },
  links: [ { href: "https://itsfoss.com/authenticator/" } ],
  categories: [
    { term: "Software", label: "Software" },
    { term: "App of the week", label: "App of the week" }
  ],
  contributors: undefined
}
*/