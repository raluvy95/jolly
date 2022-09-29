// NEW FEATURE COMING SOON

import { JollyDB } from "@classes/database.ts";
import { BigString, QueryParameterSet } from "@deps";

class LevelDB extends JollyDB {
    constructor() {
        super(`CREATE TABLE IF NOT EXISTS level (
            userid text
            xp int,
            level int,
        );`)
    }

    private getter(sql: string, variables?: QueryParameterSet) {
        const result = this.query(sql, variables) as LevelResultDB
        const r = []
        for (const re of result) {
            r.push({
                userid: re[0],
                xp: re[1],
                level: re[2]
            })
        }
        return r.sort((a, b) => b.level - a.level)
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
}


type LevelResultDB = [[string, number, number]]


export const level = new LevelDB()

export interface ILevelResultDB {
    userid: string,
    xp: number,
    level: number
}