// more accurate than formula used in video game :skull:

export function XPrequiredToLvlUP(level: number) {
    return 5 * (Math.pow(level, 2)) + (50 * level) + 100
}

export function progressBar(currentXP: number, requiredXP: number): string {
    const fill = "🟩"
    const empty = "⬛"
    const fillN = Math.floor(currentXP / requiredXP * 10)
    const emptyN = 10 - fillN
    try {
        return fill.repeat(fillN) + empty.repeat(emptyN)
    } catch {
        return '???'
    }
}