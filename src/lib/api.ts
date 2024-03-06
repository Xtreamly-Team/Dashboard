import { AggergatedSlippageAmount, SwapTransaction } from "./models/models";

const SERVER_HOST = 'http://test.xtreamly.io:5000';
const API_URL = `${SERVER_HOST}/api/v1`;

export async function getSwapTransactions(from: number = 0, to: number = 0, limit: number = 10): Promise<SwapTransaction[]> {
    let requestUrl = `${API_URL}/Slippage/SlippageHistory`
    let queryParams = new URLSearchParams({
        startTime: from == 0 ? '0' : `${from}`,
        endTime: to == 0 ? '0' : `${to}`,
        skip: '0',
        limit: `${limit}`,
    })

    const response = await fetch(`${requestUrl}?${queryParams}`);

    const rawRes = await response.json();
    console.log(rawRes);
    const swapTransactions = SwapTransaction.fromServerResponse(rawRes);
    return swapTransactions
}

export async function getSwapTransactionsForIntervals(intervals: number[], limit: number = 10000): Promise<SwapTransaction[][]> {
    let intervalTransactions: SwapTransaction[][] = [];
    for (let i = 0; i < intervals.length - 1; i++) {
        let from = intervals[i];
        let to = intervals[i + 1];
        let transactions = await getSwapTransactions(from, to, limit);
        intervalTransactions.push(transactions);
    }
    return intervalTransactions
}

export async function getSlippageAmountForIntervals(intervals: number[]): Promise<AggergatedSlippageAmount[]> {
    let intervalAggregates: AggergatedSlippageAmount[] = [];
    let requestUrl = `${API_URL}/Slippage/SlippageHistoryReport`
    for (let i = 0; i < intervals.length - 1; i++) {
        let queryParams = new URLSearchParams({
            startTime: `${intervals[i]}`,
            endTime: `${intervals[i + 1]}`,
        })
        const response = await fetch(`${requestUrl}?${queryParams}`);
        const rawRes = await response.json();
        console.log(rawRes);
        let aggregatedAmount = AggergatedSlippageAmount.fromServerResponse(rawRes);
        intervalAggregates.push(aggregatedAmount);
    }

    return intervalAggregates;
}
