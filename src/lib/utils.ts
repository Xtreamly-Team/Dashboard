import { getBlockForTimestamp } from "./api";
import { Token, TokenPair } from "./models";

export const StableCoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'SUSD', 'GUSD', 'HUSD'];

export const LP_USDT = [
    "0x11b815efB8f581194ae79006d24E0d814B7697F6".toLowerCase(),
    "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36".toLowerCase(),
    "0xC5aF84701f98Fa483eCe78aF83F11b6C38ACA71D".toLowerCase(),
    "0xc7bBeC68d12a0d1830360F8Ec58fA599bA1b0e9b".toLowerCase(),
]
export const LP_USDC = [
    "0xE0554a476A092703abdB3Ef35c80e0D76d32939F".toLowerCase(),
    "0x7BeA39867e4169DBe237d55C8242a8f2fcDcc387".toLowerCase(),
    "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8".toLowerCase(),
    "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640".toLowerCase(),
]

export function truncateNumber(num: number, precision = 5): string {
    return num.toFixed(precision);
}

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

export function getCurrentTime(seconds=true) {
    const currentTimestamps = new Date().valueOf()
    if (seconds) {
        return Math.floor(currentTimestamps / 1000);
    } else {
        return Math.floor(currentTimestamps);
    }
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
