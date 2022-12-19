function zero(numb: number): string {
    let str = numb.toString()
    if (str.length == 1) {
        str = "0" + str
    }
    return str
}

export function dateToString(date: Date, opts?: { clockOnly?: boolean, includesTimezone?: boolean, timezone?: string }): string {
    date = new Date(date.toLocaleString('en', { timeZone: opts?.timezone }))
    return `${opts?.clockOnly ? '' : date.toDateString() + ' '}${date.getHours()}:${zero(date.getMinutes())}${!opts?.clockOnly ? ":" + zero(date.getSeconds()) : ''}${opts?.includesTimezone ? ' (' + date.toLocaleTimeString('en-us', { timeZoneName: 'short', timeZone: opts.timezone }).split(' ')[2] + ')' : ''}`
}

const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: "year", ms: 31536000000 },
    { unit: "month", ms: 2628000000 },
    { unit: "day", ms: 86400000 },
    { unit: "hour", ms: 3600000 },
    { unit: "minute", ms: 60000 },
    { unit: "second", ms: 1000 },
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 */
export function relativeTimeFromDates(relative: Date | null, pivot: Date = new Date()): string {
    if (!relative) return "";
    const elapsed = relative.getTime() - pivot.getTime();
    return relativeTimeFromElapsed(elapsed);
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 */
export function relativeTimeFromElapsed(elapsed: number): string {
    for (const { unit, ms } of units) {
        if (Math.abs(elapsed) >= ms || unit === "second") {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }
    return "";
}