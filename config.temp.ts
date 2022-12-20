import { IJollyConfig } from "./src/interfaces/config.ts";
import { Plugins } from "./src/interfaces/plugins.ts";
// deno-lint-ignore no-unused-vars
import { custom } from "./custom/reactionroles.temp.ts";    // => Imports the Constant from reaction roles; Rename the file link here and add the file name as reactionroles.ts

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
        enable: false,
        reactions: [
            {
                channelID: "channelID",
                messageID: "messageID",
                /*
                "one" => Single choice
                "multiple" => multiple choices
                */
                type: "multiple",
                // Useful to hide reaction count (known as anonymous)
                removeReactionAfterTrigger: false,
                roleEmojis: [
                    {
                        roleID: "roleID",
                        /*
                            Also support custom Discord emoji with this format
                            Basic: <:name:id>
                            Animated: <a:name:id>
                        */
                        emoji: "emoji"
                    }
                ]
                // (add this array to a reactionrole.ts file and then add ...<your const name> in place of the array here)
            }
        ]
    },
    showContentOnMessageLink: false,
    bump: {
        enable: false,
        // Role ID for mention bump role.
        roleID: "roleID"
    },
    ree: false,
    sudo: false,
    // Enable sniper feature and use sniper command (leaks latest deleted message)
    sniper: false,
    selfping: {
        enable: false,
        // Custom message for trigger when someone pings your bot
        // (optional)
        customMessage: ""
    },
    nicknameOnJoin: {
        enable: false,
        // Nickname to change on join
        // Use {user} as variable to use user's name
        // Only works in suffix
        nickname: "catnow{user}"
    },
    autoPublish: {
        enable: false,
        // Only publish bot's messages
        botOnlyChannelID: [],
        // Publish messages, regardess of bot or user
        channelID: []
    },
    /*
        Autorole with Membership screen support
    */
    autorole: {
        enable: false,
        userRoleID: "roleID",
        botRoleID: "roleID"
    },
    /*
       Post random post from Subreddit
    */
    autopost: {
        enable: false,
        posts: [
            {
                name: "XD",
                channelID: "",
                subredditToFollow: [],
                intervalInMinutes: 30
            }
        ]
    },
    /*
        AutoCreateChannel
        Creates new channel if someone mentions inexistent channel such as #staff-furry-role
    */
    autoCreateChannel: {
        enable: false,
        // Set undefined to create outside of categories
        categoryID: "category ID"
    },
    ghostPing: false,
    /*
       AutoRenameChannel
       Changes channel's name every X minutes
    */
    autoRenameChannel: {
        enable: false,
        // target channel to rename
        // It can be voice or text
        channelID: "channel ID",
        // Variables to use for replacement
        variables: [
            "people",
            "cats",
            "dogs"
        ],
        // Use $ to replace with a choice of variables above
        nameToBeReplaced: "cool $"
    },
    levelXP: {
        enable: false,
        rolesRewards: [
            {
                ID: "role ID",
                level: 4
            }
        ],
        levelUP: {
            // Use "0" to send on channel where user has sent and reached level up
            channelID: "0",
            customMessage: "Congrats {user}, you just reached level {level}!"
        },
        // Reward with 100 XP when someone bumps this server
        // Only if bump reminder plugin is enabled 
        rewardWhenBump: true,
        // Ignores cooldown for specific role
        // (optional as [])
        ignoreCooldownRoles: [
            "role ID"
        ],
        // Ignores gaining XP for specific channel
        // (optional as [])
        ignoreXPChannels: [
            "channel ID"
        ],
        multiplyXP: 1,
        minXP: 15,
        maxXP: 25
    },
    funfact: {
        enable: false,
        // documentation: https://github.com/raluvy95/jolly/wiki/Source-for-Fun-fact
        source: "URL",
        intervalInMin: 120,
        channelID: "channelID"
    },
    clockChannel: {
        enable: false,
        channelID: "channel ID",
        channelName: "$EMOJI $TIME",
        timezone: "Europe/Bucharest",
        intervalInMinutes: 5
    },
    rss: {
        enable: false,
        // This RSS plugin supports the following format
        // Atom, RSS1 and RSS2
        feedsURL: [
            "feed URL"
        ],
        channelID: "channel ID",
        customMessage: "📰 | **$title**\n\n$url"
    },
    logging: {
        enable: false,
        warnLogChannelID: "channel ID",
        events: []
    },
    // This also needs to have 
    // --unstable enabled in deno.jsonc
    // if you want to have music support
    music: {
        enable: false
    },
    starboard: {
        enable: false,
        channelID: "channel ID",
        requiredStarCount: 3,
        // Ignore reacting yourself in your own message
        ignoreReactionYourself: true
    }
} as Plugins

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
