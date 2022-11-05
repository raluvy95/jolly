import { BigString, Bot, BotWithCache, DiscordChannel, ModifyChannel } from "@deps";

export async function editChannel(client: BotWithCache<Bot>, channelId: BigString, options: ModifyChannel) {

    const result = await client.rest.runMethod<DiscordChannel>(
        client.rest,
        "PATCH",
        client.constants.routes.CHANNEL(channelId),
        {
            name: options.name,
            topic: options.topic,
            bitrate: options.bitrate,
            user_limit: options.userLimit,
            rate_limit_per_user: options.rateLimitPerUser,
            position: options.position,
            parent_id: options.parentId === null ? null : options.parentId?.toString(),
            nsfw: options.nsfw,
            type: options.type,
            archived: options.archived,
            auto_archive_duration: options.autoArchiveDuration,
            locked: options.locked,
            invitable: options.invitable,
            permission_overwrites: options.permissionOverwrites
                ? options.permissionOverwrites?.map((overwrite) => ({
                    id: overwrite.id.toString(),
                    type: overwrite.type,
                    allow: overwrite.allow ? client.utils.calculateBits(overwrite.allow) : null,
                    deny: overwrite.deny ? client.utils.calculateBits(overwrite.deny) : null,
                }))
                : undefined,
            available_tags: options.availableTags
                ? options.availableTags.map((availableTag) => ({
                    id: availableTag.id,
                    name: availableTag.name,
                    moderated: availableTag.moderated,
                    emoji_id: availableTag.emojiId,
                    emoji_name: availableTag.emojiName,
                }))
                : undefined,
            default_reaction_emoji: options.defaultReactionEmoji
                ? {
                    emoji_id: options.defaultReactionEmoji.emojiId,
                    emoji_name: options.defaultReactionEmoji.emojiName,
                }
                : undefined,
            reason: options.reason,
        },
    );

    return client.transformers.channel(client, {
        channel: result, guildId: client.transformers.snowflake(result.guild_id!)
    });
}