import { Emoji, Member, User } from "@deps";

export interface ReactionRmPayload {
    userId: bigint;
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint | undefined;
    emoji: Emoji;
}

export interface ReactionAddPayload extends ReactionRmPayload {
    member?: Member | undefined;
    user?: User | undefined;
}