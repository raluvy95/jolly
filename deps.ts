export * from "https://deno.land/x/discordeno@17.1.0/mod.ts";
export * from "https://deno.land/x/discordeno@17.1.0/plugins/cache/mod.ts";
export { hasGuildPermissions, enablePermissionsPlugin } from "https://deno.land/x/discordeno@17.1.0/plugins/permissions/mod.ts";
export * from "https://deno.land/std@0.152.0/fmt/colors.ts";
export { default as config } from "./config.json" assert { type: "json" };
export * from "https://deno.land/x/sqlite@v3.4.0/mod.ts";
// fork of discordeno-audio-plugin to work with discordeno v17.0.0
export { enableAudioPlugin } from "https://raw.githubusercontent.com/raluvy95/discordeno-audio-plugin/main/mod.ts";
export type { AudioBot } from "https://raw.githubusercontent.com/raluvy95/discordeno-audio-plugin/main/mod.ts";

// fork of rss to fix breaking the bot
export { parseFeed } from "https://raw.githubusercontent.com/raluvy95/rss/master/mod.ts";

// local lib
// export { enableAudioPlugin } from "../discordeno-audio-plugin/mod.ts";
// export type { AudioBot } from "../discordeno-audio-plugin/mod.ts";
// export { parseFeed } from "../rss/mod.ts";
