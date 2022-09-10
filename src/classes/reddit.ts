import { RootObject, Data2 } from "../interfaces/reddit.ts";
import { JollyEmbed } from "@classes/embed.ts";
import { Embed } from "@deps";
import { EmptyError } from "@const/errors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { COLORS } from "@const/colors.ts";

export class Reddit {
    private readonly url: string;
    private readonly subreddit: string
    private result: RootObject | undefined;

    constructor(subreddit: string, sort?: string) {
        this.subreddit = subreddit
        this.url = `https://reddit.com/r/${subreddit}${!sort ? ".json" : "/" + sort + ".json"}`
    }

    private async fetch(): Promise<RootObject> {
        if (!this.result) {
            this.result = await fetch(this.url).then(r => {
                if (r.status != 200) throw new Error(String(r.status) + ` ${this.subreddit}`)
                return r.json()
            })
        }
        return this.result as RootObject
    }

    public static isMedia(v: string) {
        function ends(str: string): boolean {
            return v.endsWith(str)
        }
        return ends(".jpg") || ends(".png") || ends(".jpeg") || ends(".webp") || ends(".gif")
    }

    async toData(media_only?: boolean, sfw_only?: boolean): Promise<Data2> {
        const r = await this.fetch()
        let random: number = Math.floor(Math.random() * r.data.children.length)
        if (!media_only) {
            return r.data.children[random].data
        } else if (sfw_only) {
            const filtered = r.data.children.filter(v => {
                return !v.data.over_18
            })
            if (filtered.length < 1) throw new EmptyError("The data is full of nsfw.")
        }
        const filtered = r.data.children.filter(v => {
            return Reddit.isMedia(v.data.url)
        })
        if (filtered.length < 1) throw new EmptyError("There are no media sadly :(")
        random = Math.floor(Math.random() * filtered.length)
        return filtered[random].data
    }

    private toRealUTC(reddit_utc: number): number {
        const miss = 13 - String(reddit_utc).length
        return Number(String(reddit_utc) + "0".repeat(miss))
    }

    async toEmbed(media_only?: boolean, sfw_only?: boolean): Promise<Embed[]> {
        const data = await this.toData(media_only, sfw_only)
        const realUTC = this.toRealUTC(data.created_utc)
        const e = new JollyEmbed()
            .setTitle(data.title)
            .setTime(realUTC)
            .setColor(data.author_flair_text_color || COLORS.RANDOM)
            .setURL("https://reddit.com" + data.permalink)
            .setFooter(`u/${data.author} - r/${this.subreddit}`)
        if (media_only || Reddit.isMedia(data.url)) {
            e.setImg(data.url)
            return e.build()
        } else if (data.selftext) {
            e.setDesc(data.selftext.slice(0, EMBED.DESCRIPTION - 5) + "...")
        }
        if (data.is_video) {
            e.setDesc(`[Video](${data.url})`)
                .setThumb(data.thumbnail)
        }
        return e.build()
    }
}
