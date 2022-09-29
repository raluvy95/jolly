import { IResultDB } from "@classes/warning.ts";

export function recentWarnings(warnings: IResultDB[]): IResultDB[] {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return warnings.filter(m => new Date(m.data) > sixMonthsAgo)
}