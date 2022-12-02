import { JollyDB } from "@classes/database.ts";
import { BigString, Bot, BotWithCache, ChannelTypes, Collection, config, Message, QueryParameterSet } from "@deps";
import { XPrequiredToLvlUP } from "@utils/levelutils.ts";
import { levelEvent } from "@classes/events.ts";

class LevelDB extends JollyDB {
    constructor() {
        super(`CREATE TABLE IF NOT EXISTS level (
            userid text,
            xp int,
            level int,
            totalxp int
        );`)
    }

    private getter(sql: string, variables?: QueryParameterSet) {
        const result = this.query(sql, variables) as LevelResultDB
        const r = []
        for (const re of result) {
            r.push({
                userid: re[0],
                xp: re[1],
                level: re[2],
                totalxp: re[3]
            })
        }
        return r.sort((a, b) => b.totalxp - a.totalxp)
    }

    removeAll() {
        this.query("DELETE FROM level")
    }

    remove(user: BigString) {
        if (typeof user == "bigint") {
            user = String(user)
        }
        this.query("DELETE FROM level WHERE userid = ?", [user])
    }

    get(user: BigString) {
        if (typeof user == "bigint") {
            user = String(user)
        }
        return this.getter("SELECT * FROM level WHERE userid = ?", [user])[0]
    }

    setXP(channel: BigString, client: BotWithCache<Bot>, user: BigString, value: number, type: XP_METHOD) {
        const exists = this.get(user)
        if (typeof user == "bigint") {
            user = String(user)
        }
        if (!exists) {
            this.query("INSERT INTO level (userid, xp, level, totalxp) VALUES (?, ?, ?, ?)", [user, value, 0, value])
        } else {
            switch (type) {
                case XP_METHOD.ADD:
                    exists.xp += value
                    exists.totalxp += value
                    if (exists.xp >= XPrequiredToLvlUP(exists.level)) {
                        exists.xp = 0
                        exists.level++
                        levelEvent.emit("levelUP", client, exists.level, channel, exists.userid)
                        this.query("UPDATE level SET level = ? WHERE userid = ?", [exists.level, user])
                    }
                    this.query("UPDATE level SET xp = ? WHERE userid = ?", [exists.xp, user])
                    this.query("UPDATE level SET totalxp = ? WHERE userid = ?", [exists.totalxp, user])
                    break
                case XP_METHOD.SET:
                    exists.xp = value
                    exists.totalxp = value
                    this.query("UPDATE level SET xp = ? WHERE userid = ?", [exists.xp, user])
                    this.query("UPDATE level SET totalxp = ? WHERE userid = ?", [exists.totalxp, user])
                    break
                case XP_METHOD.RESET:
                    this.query("DELETE FROM level WHERE userid = ?", [user])
                    this.query("INSERT INTO level (userid, xp, level, totalxp) VALUES (?, ?, ?, ?)", [user, 0, 0, 0])
                    break
            }
        }
    }

    getAll() {
        return this.getter("SELECT * FROM level")
    }

    setLevel(user: BigString, value: number) {
        const exists = this.get(user)
        if (typeof user == "bigint") {
            user = String(user)
        }
        if (!exists) {
            this.query("INSERT INTO level (userid, xp, level, totalxp) VALUES (?, ?, ?, ?)", [user, 0, value, XPrequiredToLvlUP(value + 1)])
        } else {
            this.query("UPDATE level SET level = ? WHERE userid = ?", [value, user])
        }
    }
}

type LevelResultDB = [[string, number, number, number]]

export enum XP_METHOD {
    SET,
    ADD,
    RESET
}

export async function handleXP(client: BotWithCache<Bot>, message: Message) {
    const xpconf = config.plugins.levelXP
    if (!xpconf.enable) return;
    if (message.isFromBot && client.channels.get(message.channelId)?.type == ChannelTypes.DM) return;
    if (xpconf.ignoreXPChannels!.includes(String(message.channelId))) return;
    const member = client.members.get(message.authorId) || await client.helpers.getMember(config.guildID, message.authorId)
    if (!member?.roles?.some(id => xpconf.ignoreCooldownRoles!.includes(String(id)))) {
        if (!levelCooldown.has(message.authorId)) {
            levelCooldown.set(message.authorId, 0)
        }
        const now = Date.now();
        const ca = 60 * 1000;
        const user = message.authorId;
        const et = levelCooldown.get(user) as number + ca;
        if (now < et) return;
        levelCooldown.set(user, now);
        setTimeout(() => {
            levelCooldown.delete(user);
        }, ca);
    }
    const addXP = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
    level.setXP(message.channelId, client, message.authorId, addXP, XP_METHOD.ADD)
}

export const level = new LevelDB()

export interface ILevelResultDB {
    userid: string
    xp: number
    level: number
    totalxp: number
}

export const levelCooldown = new Collection<bigint, number>()
