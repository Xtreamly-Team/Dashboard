import { getBlockForTimestamp } from "./api";
import { Token, TokenPair } from "./models/models";

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


export const StableCoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'SUSD', 'GUSD', 'HUSD'];

// Timestamp in epoch seconds
export function getPreviousDaysStart(days: number, fromTimestamp: number = 0) {
    const dates = [];
    for (let i = 0; i <= days; i++) {
        let date = new Date();
        if (fromTimestamp) {
            date = new Date(fromTimestamp * 1000);
        }
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
        date.setDate(date.getDate() - 7 * i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }
    return dates.reverse().map((e) => Math.floor(e.valueOf() / 1000));
}

export function timestampToDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    date.setHours(0, 0, 0, 0);
    return date
}

export function getIntervalDates(intervalTimestampsSeconds: number[]): Date[] {
    const dates = [];
    for (let interval of intervalTimestampsSeconds) {
        const date = new Date(interval * 1000);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }
    return dates;
}


export function getSupportedTokens() {
    const WETH = new Token('WETH', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

    const USDT = new Token('USDT', '0xdac17f958d2ee523a2206206994597c13d831ec7');

    const USDC = new Token('USDC', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');

    const DAI = new Token('DAI', '0x6b175474e89094c44da98b954eedeac495271d0f');
    return [WETH, USDT, USDC, DAI];
}


export async function getLatestBlock() {
    return await getBlockForTimestamp(Math.floor((new Date()).valueOf() / 1000));
}

export async function getBlockIntervals(intervals: number[]) {
    let blockNumbers = await Promise.all(intervals.map(async (interval) => { return getBlockForTimestamp(interval) }))
    return blockNumbers
}
