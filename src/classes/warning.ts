import { QueryParameterSet } from "@deps";
import { JollyDB } from "@classes/database.ts";

class WarningDB extends JollyDB {
    constructor() {
        super(`CREATE TABLE IF NOT EXISTS warnings (
            caseid text,
            userid bigint,
            username text,
            moderator bigint,
            moderator_name text,
            reason text,
            date bigint
        );`)
    }

    push(userid: bigint, username: string, reason: string, moderator: bigint, moderator_name: string): IResultDB {
        const caseID = Math.random().toString(36).slice(2, 8)
        const now = Date.now()
        this.query("INSERT INTO warnings (caseid, userid, username, moderator, moderator_name, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [caseID, userid, username, moderator, moderator_name, reason, now])
        return {
            case: caseID,
            userid: userid,
            username: username,
            moderator: moderator,
            moderator_name: moderator_name,
            reason: reason,
            data: now
        }
    }

    private getter(sql: string, variables?: QueryParameterSet) {
        const result = this.query(sql, variables) as ResultDB
        const r = []
        for (const re of result) {
            r.push({
                case: re[0],
                userid: re[1],
                username: re[2],
                moderator: re[3],
                moderator_name: re[4],
                reason: re[5],
                data: re[6]
            })
        }
        return r.sort((a, b) => b.data - a.data)
    }

    getAll() {
        return this.getter("SELECT * FROM warnings")
    }

    getByUser(user: bigint) {
        return this.getter("SELECT * FROM warnings WHERE userid = ?", [user])
    }

    getByCaseID(caseID: string): IResultDB {
        return this.getter("SELECT * FROM warnings WHERE caseid = ?", [caseID])[0]
    }

    remove(caseID: string): boolean {
        const caseID2 = this.getByCaseID(caseID)
        if (!caseID2) return false
        this.query("DELETE FROM warnings WHERE caseid = ?", [caseID])
        return true
    }

    removeAll(userid: bigint): boolean {
        const userID = this.getByUser(userid)
        if (!userID) return false
        this.query("DELETE FROM warnings WHERE userid = ?", [userid])
        return true
    }

    editReason(caseID: string, reason: string): boolean {
        const caseID2 = this.getByCaseID(caseID)
        if (!caseID2) return false
        this.query("UPDATE warnings SET reason = ? WHERE caseid = ?", [reason, caseID])
        return true
    }
}

type ResultDB = [[string, bigint, string, bigint, string, string, number]]

export interface IResultDB {
    userid: bigint
    username: string
    moderator: bigint
    moderator_name: string
    reason: string
    data: number
    case: string
}

export const warning = new WarningDB()
