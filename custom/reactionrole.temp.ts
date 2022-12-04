//rename this file from reactionrole.temp.ts to reactionrole.ts

export const custom = {
    roleEmojis: [
        // If you want to do multiple reactions, copy/paste this set below, add a comma to any closing brackets (except for the last one), and change the value of the RoleID and the Emoji
        // Otherwise, just leave one

        // Make sure to change the value in the config.ts file from one to multiple if you are doing multiple reactions
        {
            roleID: "roleID",
            /*
                Also support custom Discord emoji with this format
                Basic: <:name:id>
                Animated: <a:name:id>
            */
            emoji: "✅"
        }
    ]
}