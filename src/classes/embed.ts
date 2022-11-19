import {
    DiscordEmbed, DiscordEmbedField,
    DiscordEmbedAuthor, DiscordEmbedFooter,
    DiscordEmbedThumbnail, DiscordEmbedImage, Embed,
} from "@deps";
import { OverflowError } from "@const/errors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { COLORS } from "@const/colors.ts";
import { JollyCommand, prefix } from "@classes/command.ts";
import { IResultDB } from "@classes/warning.ts";
import { dateToString } from "@utils/dateToString.ts";

const hexToDecimal = (hex: string) => parseInt(hex, 16)

export class JollyEmbed implements DiscordEmbed {
    public title?: string | undefined;
    public description?: string | undefined;
    public image?: DiscordEmbedImage | undefined;
    public author?: DiscordEmbedAuthor | undefined;
    public fields?: DiscordEmbedField[] | undefined;
    public thumbnail?: DiscordEmbedThumbnail | undefined;
    public url?: string | undefined;
    public footer?: DiscordEmbedFooter | undefined;
    public color?: number | undefined;
    public timestamp?: string | undefined;

    constructor() {
        this.timestamp = new Date().toISOString()
        this.fields = []
        this.color = COLORS.RANDOM
        return this;
    }

    build(): Embed[] {
        return [this.toJSON()]
    }

    setTitle(name: string | null): this {
        if (name != null && name.length > EMBED.TITLE) throw new OverflowError("Title", EMBED.TITLE)
        this.title = name == null ? undefined : name
        return this;
    }

    setFooter(name: string, iconURL?: string): this {
        this.footer = { text: name, icon_url: iconURL }
        return this;
    }

    setDesc(desc: string | null): this {
        if (desc != null && desc.length > EMBED.DESCRIPTION) throw new OverflowError("Description", EMBED.DESCRIPTION)
        this.description = desc == null ? undefined : desc
        return this;
    }

    setImg(url: string | null): this {
        if (url == null) {
            this.image = undefined
            return this
        }
        this.image = { url: url }
        return this;
    }

    setURL(url: string | null): this {
        this.url = url == null ? undefined : url
        return this;
    }

    setAuthor(name: string, iconURL?: string, url?: string): this {
        this.author = { name: name, icon_url: iconURL, url: url }
        return this
    }

    setColor(color: COLORS | string | null): this {
        if (color == COLORS.RANDOM) {
            color = Math.floor(Math.random() * 16777215)
        }
        if (typeof color == "string") {
            color = hexToDecimal(color.replace("#", ''))
        }
        if (color == null) {
            this.color = undefined
            return this
        }
        this.color = color
        return this
    }

    addField(name: string, value: string, inline?: boolean): this {
        if (name.length > EMBED.FIELD_NAME) throw new OverflowError("Field name", EMBED.FIELD_NAME)
        else if (value.length > EMBED.FIELD_VALUE) throw new OverflowError("Field value", EMBED.FIELD_VALUE)
        this.fields!.push({ name: name, value: value, inline: inline })
        return this;
    }

    addFields(fields: DiscordEmbedField[] | null): this {
        if (fields == null) {
            this.fields = []
            return this
        }
        if (fields.length > EMBED.FIELDS) throw new OverflowError("Fields", EMBED.FIELDS)
        for (const field of fields) {
            this.addField(field.name, field.value, field.inline)
        }
        return this
    }

    setThumb(url: string | null): this {
        url = url == null ? '' : url
        this.thumbnail = { url: url }
        return this
    }

    setTime(date: number | Date | null): this {
        if (date == null) {
            this.timestamp = undefined
            return this
        }
        if (typeof date == "number") {
            date = new Date(date)
        }
        this.timestamp = date.toISOString()
        return this
    }

    toJSON(): Embed {
        return {
            title: this.title,
            description: this.description,
            image: this.image,
            thumbnail: this.thumbnail,
            timestamp: this.timestamp == null ? undefined : Date.parse(this.timestamp),
            type: "rich",
            author: {
                name: this.author?.name as string,
                // for some reasons, Embed wants iconUrl and not icon_url
                iconUrl: this.author?.icon_url
            },
            color: this.color == COLORS.RANDOM ? Math.floor(Math.random() * 16777215) : this.color,
            url: this.url,
            footer: {
                iconUrl: this.footer?.icon_url,
                text: this.footer?.text as string
            },
            fields: this.fields
        }
    }

    command(command: JollyCommand): Embed[] {
        function bool(boo: boolean | undefined): string {
            return boo ? "Yes" : "No"
        }
        return this
            .setTitle(`Command: ${command.name}`)
            .setDesc(command.description)
            .addField("Aliases", !command.aliases.length ? "No aliases" : command.aliases.join(", "))
            .addField("Usage", `${prefix + command.name} ${command.usage}`, true)
            .addField("Cooldown (sec)", String(command.cooldown), true)
            .addField("Is owner?", bool(command.owner), true)
            .addField("Permissions required", command.permission ? command.permission.join(", ") : "No permission required", true)
            .build()
    }

    warn(warnInfo: IResultDB) {
        return this
            .setTitle(`Case ID: ${warnInfo.case} | User: ${warnInfo.username} (${warnInfo.userid})`)
            .setDesc(`**Date:** ${dateToString(new Date(warnInfo.data))}`)
            .addField("Modernator", `**${warnInfo.moderator_name}** (${warnInfo.moderator})`, true)
            .addField("Reason", warnInfo.reason, true)
            .setColor(COLORS.RED)
            .build()
    }
}
