export function getEmojiName(emoji: string) {
    if (emoji.startsWith("<")) {
        const [_, name, _id] = emoji.split(":")
        emoji = name
    }
    return emoji
}
