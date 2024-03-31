import { AggergatedSlippageAmount, LPSnapshot, PoolVolatilitiesSnapshot, SwapTransaction, TokenPair, TokenVolume, TokenVolumesSnapshot } from "./models/models";
import { getBlockIntervals } from "./utils";
import { HubConnectionBuilder } from '@microsoft/signalr'

const SERVER_HOST = 'https://test.xtreamly.io:5000';
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
        let aggregatedAmount = AggergatedSlippageAmount.fromServerResponse(intervals[i], rawRes);
        intervalAggregates.push(aggregatedAmount);
    }

    return intervalAggregates;
}

// Takes second not millisecond
export async function getVolatilityForIntervals(intervals: number[]): Promise<PoolVolatilitiesSnapshot[]> {
    let volatilitySnapshots: PoolVolatilitiesSnapshot[] = [];
    let requestUrl = `${API_URL}/Volatility/GetVolatilityForAllPools`
    for (let i = 0; i < intervals.length - 1; i++) {
        let queryParams = new URLSearchParams({
            start: `${intervals[i]}`,
            end: `${intervals[i + 1]}`,
        })
        const response = await fetch(`${requestUrl}?${queryParams}`);
        const rawRes = await response.json();
        const poolVolatilities = PoolVolatilitiesSnapshot.fromServerResponse(intervals[i], rawRes);
        volatilitySnapshots.push(poolVolatilities)
    }

    return volatilitySnapshots
}

// TODO: Make parallel
export async function getVolumeForAllTokens(intervals: number[]): Promise<TokenVolumesSnapshot[]> {
    let volumes: TokenVolumesSnapshot[] = [];
    let requestUrl = `${API_URL}/Volume/GetVolumeForAllTokens`
    for (let i = 0; i < intervals.length - 1; i++) {
        let queryParams = new URLSearchParams({
            start: `${intervals[i]}`,
            end: `${intervals[i + 1]}`,
        })
        const response = await fetch(`${requestUrl}?${queryParams}`);
        const rawRes = await response.json();
        volumes.push(
            new TokenVolumesSnapshot(intervals[i],
                TokenVolume.fromServerResponse(rawRes)));
    }

    return volumes
}


export async function getPoolsForTokenPair(tokenPair: TokenPair): Promise<LPSnapshot[]> {
    let pools: LPSnapshot[] = [];
    let requestUrl = `${API_URL}/Utilities/GetPoolForTokens`
    let queryParams = new URLSearchParams({
        token0: tokenPair.tokenIn.address,
        token1: tokenPair.tokenOut.address
    })
    const response = await fetch(`${requestUrl}?${queryParams}`);
    const rawRes = await response.json();

    rawRes.forEach((poolAddress: any) => {
        if (poolAddress.startsWith('0x00000')) return
        pools.push(new LPSnapshot(poolAddress.toLowerCase(), tokenPair))
    })

    return pools
}

export async function getBlockTimestamp(blockNumber: number): Promise<number> {
    let requestUrl = `${API_URL}/Utilities/BlockToTime`
    let queryParams = new URLSearchParams({
        blockNumber: `${blockNumber}`
    })
    const response = await fetch(`${requestUrl}?${queryParams}`);
    const timestamp = await response.text();
    return +timestamp
}

export async function getBlockForTimestamp(timestamp: number): Promise<number> {
    let requestUrl = `${API_URL}/Utilities/TimeToBlock`
    let queryParams = new URLSearchParams({
        timestamp: `${timestamp}`
    })
    const response = await fetch(`${requestUrl}?${queryParams}`);
    const rawRes = await response.json();
    return rawRes
}

// TODO: Check which blocknumber can be used for which LP
export async function getLPInfoWithBlock(lp: LPSnapshot, blockNumber: number): Promise<LPSnapshot> {
    let requestUrl = `${API_URL}/LpInfo/GetLpInfoForBlock`
    let queryParams = new URLSearchParams({
        poolAddress: lp.address,
        blockNumber: `${blockNumber}`
    })

    const response = await fetch(`${requestUrl}?${queryParams}`);
    const rawRes = await response.json();
    const lpInfo = await LPSnapshot.LPInfoFromServerResponse(rawRes);
    const newLP = new LPSnapshot(lp.address, lp.tokenPair, lpInfo);
    return newLP
}

// Not useful for now
export async function getLPInfoWithinInterval(lp: LPSnapshot, from: number, to: number): Promise<LPSnapshot> {
    let requestUrl = `${API_URL}/LpInfo/GetLpInfoForTime`
    let queryParams = new URLSearchParams({
        poolAddress: lp.address,
        start: `${from}`,
        end: `${to}`
    })

    const response = await fetch(`${requestUrl}?${queryParams}`);

    const rawRes = await response.json();
    return lp
}

export async function getLPInfosForBlockNumbers(lp: LPSnapshot, blockNumbers: number[]): Promise<LPSnapshot[]> {
    const lpInfoInterval = await Promise.all(blockNumbers.map(async (blockNumber) => {
        console.log(`Getting LP info for block ${blockNumber}`)
        return await getLPInfoWithBlock(lp, blockNumber);
    }))
    return lpInfoInterval
}

export async function getLPInfosForIntervals(lp: LPSnapshot, intervals: number[]): Promise<LPSnapshot[]> {
    const blockNumbers = await getBlockIntervals(intervals);
    console.log(blockNumbers)
    const lpInfoInterval = await Promise.all(blockNumbers.map(async (blockNumber) => {
        console.log(`Getting LP info for block ${blockNumber}`)
        return await getLPInfoWithBlock(lp, blockNumber);
    }))
    return lpInfoInterval
}

class CEXTrade {
    constructor(
        public timestamp: number,
        public symbol: string,
        public market: string,
        public amount: number,
        public price: number,
        public is_buy: boolean,
    ) { }
}

export async function startReceivingCeXonWebsocket(
    onReceive = async (message: CEXTrade[]) => { console.log(message) }
) {
    let connection = new HubConnectionBuilder()
        .withUrl(`${SERVER_HOST}/realtimeHub`)
        .build();

    connection.start().then(function() {
        console.log("SignalR Connected.");
    }).catch(function(err) {
        console.error(err.toString());
    });

    connection.on("CexPrice", async (data: any[]) => {
        let trades = data.map((tradeRaw) => new CEXTrade(
            tradeRaw.timestamp,
            tradeRaw.symbol,
            tradeRaw.market,
            tradeRaw.amount,
            tradeRaw.price,
            tradeRaw.is_buy,
        ))

        trades = trades.filter((t) => t.amount)

        await onReceive(trades)
    });

}
