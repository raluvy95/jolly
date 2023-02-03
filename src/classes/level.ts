import { JollyDB } from "@classes/database.ts";
import { BigString, Bot, BotWithCache, ChannelTypes, Collection, config, Message, QueryParameterSet, VoiceState } from "@deps";
import { XPrequiredToLvlUP } from "@utils/levelutils.ts";
import { levelEvent } from "@classes/events.ts";
import { getMember } from "@utils/getCache.ts";

const xpconf = config.plugins.levelXP

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
    if (!xpconf.enable) return;
    if (message.isFromBot && client.channels.get(message.channelId)?.type == ChannelTypes.DM) return;
    if (xpconf.ignoreXPChannels!.includes(String(message.channelId))) return;

    const member = await getMember(client, message.authorId)
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
    const addXP = Math.floor(Math.random() * (xpconf.maxXP! - xpconf.minXP! + 1)) + xpconf.minXP!;
    level.setXP(message.channelId, client, message.authorId, addXP * xpconf.multiplyXP!, XP_METHOD.ADD)
}


const connectedVC: VoiceState[] = []

export async function handleXPVoice(client: BotWithCache<Bot>, vs: VoiceState) {
    if (!xpconf.enable) return;
    if (!xpconf.gainXPonVC) return;

    const user = client.users.get(vs.userId) || await client.helpers.getUser(vs.userId)
    if (user.toggles.bot) return

    if (!vs.channelId) {
        const finduser = connectedVC.map(e => e.userId).indexOf(vs.userId)
        if (finduser > -1) {
            connectedVC.splice(finduser, 1)
        }
    } else if (connectedVC.findIndex(m => m.userId == vs.userId) == -1) {
        connectedVC.push(vs)
    } else {
        const finduser = connectedVC.map(e => e.userId).indexOf(vs.userId)
        if (finduser > -1) {
            connectedVC.splice(finduser, 1)
            connectedVC.push(vs)
        }
    }
}

export const level = new LevelDB()

export interface ILevelResultDB {
    userid: string
    xp: number
    level: number
    totalxp: number
}

const levelCooldown = new Collection<bigint, number>()
const levelCooldownVoice = new Collection<bigint, number>()

export function handleXPVoiceLoop(client: BotWithCache<Bot>) {
    if (xpconf.gainXPonVC) {
        setInterval(() => {
            const filteredConnectedVC = connectedVC.filter(m => !m.toggles.selfMute && !m.toggles.mute)
            const atLeastTwoPeople = connectedVC.length >= 2
            if (filteredConnectedVC.length < 1) return
            if (!atLeastTwoPeople) return;
            for (const con of filteredConnectedVC) {
                if (!levelCooldownVoice.has(con.userId)) {
                    levelCooldownVoice.set(con.userId, 0)
                }
                const now = Date.now();
                const ca = 60 * 1000;
                const user = con.userId;
                const et = levelCooldownVoice.get(user) as number + ca;
                if (now < et) {
                    continue
                }
                levelCooldownVoice.set(user, now);
                setTimeout(() => {
                    levelCooldownVoice.delete(user);
                }, ca);
                const addXP = Math.floor(Math.random() * (xpconf.maxXP! - xpconf.minXP! + 1)) + xpconf.minXP!;
                level.setXP(con.channelId!, client, con.userId, addXP, XP_METHOD.ADD)
            }
        }, 3 * 1000)
    }
}