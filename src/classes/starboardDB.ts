import { BigString, QueryParameterSet } from "../../deps.ts";
import { JollyDB } from "./database.ts";

class StarboardDB extends JollyDB {
    constructor() {
        super(`CREATE TABLE IF NOT EXISTS starboard (
            messageid text,
            channelid text,
            starCount number,
            sourceMessageid text
        );`)
    }

    private getter(sql: string, variables?: QueryParameterSet) {
        const result = this.query(sql, variables) as StarResultDB
        const r = []
        for (const re of result) {
            r.push({
                messageid: re[0],
                channelid: re[1],
                starCount: re[2],
                sourceMessageid: re[3]
            })
        }
        return r
    }

    removeAll() {
        this.query("DELETE FROM starboard")
    }

    removeMsg(msgID: BigString) {
        if (typeof msgID == "bigint") {
            msgID = String(msgID)
        }
        this.query("DELETE FROM starboard WHERE messageid = ?", [msgID])
    }

    get(msgID: BigString) {
        if (typeof msgID == "bigint") {
            msgID = String(msgID)
        }
        return this.getter("SELECT * FROM starboard WHERE messageid = ?", [msgID])[0]
    }

    getSource(msgID: BigString) {
        if (typeof msgID == "bigint") {
            msgID = String(msgID)
        }
        return this.getter("SELECT * FROM starboard WHERE sourceMessageid = ?", [msgID])[0]
    }

    setStar(msgID: BigString, channelID: BigString, starCount: number, sourceMsgID: BigString) {
        const exists = this.get(msgID)
        if (typeof msgID == "bigint") {
            msgID = String(msgID)
        }
        if (typeof channelID == "bigint") {
            channelID = String(channelID)
        }
        if (typeof sourceMsgID == "bigint") {
            channelID = String(channelID)
        }
        if (!exists) {
            this.query("INSERT INTO starboard (messageid, channelid, starCount, sourceMessageid) VALUES (?, ?, ?, ?)", [msgID, channelID, starCount, sourceMsgID])
        } else {
            this.query("UPDATE starboard SET starCount = ? WHERE messageid = ?", [starCount, msgID])
        }
    }
}

type StarResultDB = [[string, string, number, string]]

export interface IStarboardDB {
    messageid: string
    channelid: string
    starCount: number
    sourceMessageid: string
}

export const starboardDB = new StarboardDB()