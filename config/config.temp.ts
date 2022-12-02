import { IJollyConfig } from "../src/interfaces/config.ts";

/*
    TypeScript-based configuration
    Yes! You heard it! 
    Jolly v0.5.0 has fully replaced JSON config with TypeScript config
    which means you can declare variable, make custom function and so on,
    as long as you don't make changes here instead of config.ts (which obv will be replaced after git pull)

    I recommend you to install VSC
    or any text editor which supports smart autocompletition (known as Intellisense)
    to enable the autocompletition
*/


/*
    Plugin Configuration
    If enable property is true, then all properties are required.
    Otherwise it will break.
*/
const plugins = {
    reactionRole: {
        enable: false
    },
    showContentOnMessageLink: false,
    bump: {
        enable: false
    },
    ree: false,
    sudo: false,
    selfping: {
        enable: false
    },
    nicknameOnJoin: {
        enable: false
    },
    autoPublish: {
        enable: false,
    },
    autorole: {
        enable: false
    },
    autopost: {
        enable: false
    },
    autoCreateChannel: {
        enable: false
    },
    ghostPing: false,
    autoRenameChannel: {
        enable: false
    },
    levelXP: {
        enable: false
    },
    funfact: {
        enable: false
    },
    clockChannel: {
        enable: false
    },
    rss: {
        enable: false
    },
    logging: {
        enable: false
    },
    music: {
        enable: false
    }
}

export const config: IJollyConfig = {
    token: "token",
    botID: "botID",
    description: "desc",
    /* WARNING: Owners have access to eval command!!!
    Please only select certain user ID you trust!!! */
    owners: ["user ID"],
    // REQUIRED. Otherwise it will break if you put invalid guild ID lol
    guildID: "guild ID",
    prefixes: [
        "sudo ",
        "doas "
    ],
    // Set playing activity
    playingStatus: "",
    // You can leave as [] to disable autosentence
    autosentence: [
        {
            action: "timeout",
            durationInMinutes: 120,
            warnCount: 3
        },
        {
            action: "ban",
            durationInMinutes: 2160,
            warnCount: 5
        },
        {
            action: "ban",
            durationInMinutes: 0,
            warnCount: 7
        }
    ],
    // Allow bots to use command in specific channel
    // Useful if you want to let bridgers run command from Discord!
    allowBotResponsingCommandChannelID: [],
    // Plugins
    plugins: plugins
}