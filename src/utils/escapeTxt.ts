export const escape = (text: string): string => {
    return text.replace(/(\_|\*|\~|\`|\||\\|\<|\>|\:|\!)/g, "\\$1").replace(/@(everyone|here|[!&]?[0-9]{17,21})/g, "@\u200b\$1");
}