import { config, DB } from "@deps";

export class JollyDB extends DB {
    constructor(initSQL: string) {
        super("database.sqlite")
        if (config.initializeSQL) {
            this.execute(initSQL)
        }
    }
}