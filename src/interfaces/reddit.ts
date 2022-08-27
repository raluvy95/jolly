// deno-lint-ignore-file no-empty-interface

interface LinkFlairRichtext {
    e: string;
    t: string;
}

interface MediaEmbed {
}

interface RedditVideo {
    bitrate_kbps: number;
    fallback_url: string;
    height: number;
    width: number;
    scrubber_media_url: string;
    dash_url: string;
    duration: number;
    hls_url: string;
    is_gif: boolean;
    transcoding_status: string;
}

interface SecureMedia {
    reddit_video: RedditVideo;
}

interface SecureMediaEmbed {
}

interface AuthorFlairRichtext {
    a: string;
    e: string;
    u: string;
    t: string;
}

interface Gildings {
    gid_1?: number;
}

interface ResizedIcon {
    url: string;
    width: number;
    height: number;
}

interface ResizedStaticIcon {
    url: string;
    width: number;
    height: number;
}

interface AllAwarding {
    giver_coin_reward?: unknown;
    subreddit_id?: unknown;
    is_new: boolean;
    days_of_drip_extension?: unknown;
    coin_price: number;
    id: string;
    penny_donate?: unknown;
    award_sub_type: string;
    coin_reward: number;
    icon_url: string;
    days_of_premium?: unknown;
    tiers_by_required_awardings?: unknown;
    resized_icons: ResizedIcon[];
    icon_width: number;
    static_icon_width: number;
    start_date?: unknown;
    is_enabled: boolean;
    awardings_required_to_grant_benefits?: unknown;
    description: string;
    end_date?: unknown;
    sticky_duration_seconds?: unknown;
    subreddit_coin_reward: number;
    count: number;
    static_icon_height: number;
    name: string;
    resized_static_icons: ResizedStaticIcon[];
    icon_format: string;
    icon_height: number;
    penny_price?: number;
    award_type: string;
    static_icon_url: string;
}

interface RedditVideo2 {
    bitrate_kbps: number;
    fallback_url: string;
    height: number;
    width: number;
    scrubber_media_url: string;
    dash_url: string;
    duration: number;
    hls_url: string;
    is_gif: boolean;
    transcoding_status: string;
}

interface Media {
    reddit_video: RedditVideo2;
}

interface Source {
    url: string;
    width: number;
    height: number;
}

interface Resolution {
    url: string;
    width: number;
    height: number;
}

interface Variants {
}

interface Image {
    source: Source;
    resolutions: Resolution[];
    variants: Variants;
    id: string;
}

interface Preview {
    images: Image[];
    enabled: boolean;
}

export interface Data2 {
    approved_at_utc?: unknown;
    subreddit: string;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title?: unknown;
    gilded: number;
    clicked: boolean;
    title: string;
    link_flair_richtext: LinkFlairRichtext[];
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: number;
    link_flair_css_class: string;
    downs: number;
    thumbnail_height?: number;
    top_awarded_type?: unknown;
    hide_score: boolean;
    name: string;
    quarantine: boolean;
    link_flair_text_color: string;
    upvote_ratio: number;
    author_flair_background_color: string;
    subreddit_type: string;
    ups: number;
    total_awards_received: number;
    media_embed: MediaEmbed;
    thumbnail_width?: number;
    author_flair_template_id: string;
    is_original_content: boolean;
    user_reports: unknown[];
    secure_media: SecureMedia;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: string;
    secure_media_embed: SecureMediaEmbed;
    link_flair_text: string;
    can_mod_post: boolean;
    score: number;
    approved_by?: unknown;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: unknown;
    author_flair_css_class: string;
    author_flair_richtext: AuthorFlairRichtext[];
    gildings: Gildings;
    content_categories?: unknown;
    is_self: boolean;
    mod_note?: unknown;
    created: number;
    link_flair_type: string;
    wls: number;
    removed_by_category?: unknown;
    banned_by?: unknown;
    author_flair_type: string;
    domain: string;
    allow_live_comments: boolean;
    selftext_html: string;
    likes?: boolean;
    suggested_sort: string;
    banned_at_utc?: unknown;
    view_count?: unknown;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    all_awardings: AllAwarding[];
    awarders: unknown[];
    media_only: boolean;
    link_flair_template_id: string;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    call_to_action: string;
    author_flair_text: string;
    treatment_tags: unknown[];
    visited: boolean;
    removed_by?: unknown;
    num_reports?: unknown;
    distinguished: string;
    subreddit_id: string;
    author_is_blocked: boolean;
    mod_reason_by?: unknown;
    removal_reason?: unknown;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons?: unknown;
    author: string;
    discussion_type?: unknown;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: string;
    contest_mode: boolean;
    mod_reports: unknown[];
    author_patreon_flair: boolean;
    author_flair_text_color: string;
    permalink: string;
    parent_whitelist_status: string;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media: Media;
    is_video: boolean;
    post_hint: string;
    url_overridden_by_dest: string;
    preview: Preview;
}

interface Child {
    kind: string;
    data: Data2;
}

interface Data {
    after: string;
    dist: number;
    modhash: string;
    geo_filter?: unknown;
    children: Child[];
    before?: unknown;
}

export interface RootObject {
    kind: string;
    data: Data;
}
