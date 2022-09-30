export function XPrequiredToLvlUP(level: number) {
    return 60 * (Math.pow(2, level - 1))
}

export function progressBar(currentXP: number, requiredXP: number): string {
    const fill = "🟩"
    const empty = "⬛"
    const fillN = Math.floor(currentXP / requiredXP * 10)
    const emptyN = 10 - fillN
    return fill.repeat(fillN) + empty.repeat(emptyN)
}