export function truncateString(
    fullStr: string,
    strLen = 8,
    separator = "...",
    frontChars = 3,
    backChars = 4
): string {
    if (fullStr.length <= strLen) return fullStr;

    return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
    );
}

export function truncateNumber(num: number, precision = 5): string {
    return num.toFixed(precision);
}


export const stableCoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'sUSD', 'GUSD', 'HUSD'];

export function getPreviousDaysStart(days: number) {
    const dates = [];
    for (let i = 0; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }
    return dates.reverse().map((e) => Math.floor(e.valueOf() / 1000));
}

export function getPreviousWeeksStart(weeks: number) {
    const dates = [];
    for (let i = 0; i <= weeks; i++) {
        const date = new Date();
        date.setDate(date.getDate() - 7*i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }
    return dates.reverse().map((e) => Math.floor(e.valueOf() / 1000));
}
