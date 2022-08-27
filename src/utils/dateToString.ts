function zero(numb: number): string {
    let str = numb.toString()
    if (str.length == 1) {
        str = "0" + str
    }
    return str
}

export function dateToString(data: Date): string {
    return `${data.toDateString()} ${data.getHours()}:${zero(data.getMinutes())}:${zero(data.getSeconds())}`
}