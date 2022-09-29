import { DB } from "@deps";

export class JollyDB extends DB {
    constructor(initSQL: string) {
        super("database.sqlite")
        this.execute(initSQL)
    }
}