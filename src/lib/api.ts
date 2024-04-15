import { AggregatedSlippageAmount, ImpermanentLossSnapshot, LP, LPInfo, LPSnapshot, MEVTransactions, PoolVolatilitiesSnapshot, PoolVolume, PoolVolumeSnapshot, SwapTransaction, TokenPair, TokenVolume, TokenVolumesSnapshot } from "./models";
import { StableCoins, getBlockIntervals, getTradingSymbol } from "./utils";
import { HubConnectionBuilder } from '@microsoft/signalr'

const SERVER_HOST = 'https://test.xtreamly.io:5000';
const API_URL = `${SERVER_HOST}/api/v1`;
// export const PUBLIC_SERVER_URL = 'https://api.xtreamly.io'
// export const PUBLIC_TEST_API_BETA_KEY = 'lKFdfPEe3xaW5nq1rPNMNaQtrI0ffTmIUhU6SMAa'
// export const QuotePriceAPIUrl = `${PUBLIC_SERVER_URL}/quoted_price_gas_fee_pool_address`

// export const PREDICT_SLIPPAGE_API_URL = `${PUBLIC_SERVER_URL}/predict_slippage`


export async function getSwapTransactions(from: number = 0, to: number = 0, limit: number = 10):
    Promise<SwapTransaction[]> {
    let requestUrl = `${API_URL}/Slippage/SlippageHistory`
    let queryParams = new URLSearchParams({
        startTime: from == 0 ? '0' : `${from}`,
        endTime: to == 0 ? '0' : `${to}`,
        skip: '0',
        limit: `${limit}`,
    })

    const response = await fetch(`${requestUrl}?${queryParams}`);

    const rawRes = await response.json();
    // console.log(rawRes[0])
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

export async function getMEVTransactions(from: number = 0, to: number = 0, limit: number = 10):
    Promise<MEVTransactions> {
    // http://test.xtreamly.io:7321/$COMMAND
    let requestUrl = `https://test.xtreamly.io:7321/get-mevs`

    const data = {
        start_block: from,
        end_block: to,
        limit: limit,
    }

    const response = await fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    const rawRes = await response.json();
    const mevTransactions = MEVTransactions.fromServerResponse(rawRes);
    return mevTransactions
}

export async function getSlippageAmountForIntervals(intervals: number[]): Promise<AggregatedSlippageAmount[]> {
    let intervalAggregates: AggregatedSlippageAmount[] = [];
    let requestUrl = `${API_URL}/Slippage/SlippageHistoryReport`
    for (let i = 0; i < intervals.length - 1; i++) {
        let queryParams = new URLSearchParams({
            startTime: `${intervals[i]}`,
            endTime: `${intervals[i + 1]}`,
        })
        const response = await fetch(`${requestUrl}?${queryParams}`);
        const rawRes = await response.json();
        let aggregatedAmount = AggregatedSlippageAmount.fromServerResponse(intervals[i], rawRes);

        intervalAggregates.push(aggregatedAmount);
        // intervalAggregates = [...intervalAggregates, aggregatedAmount]
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

export async function getVolumeForAllPools(intervals: number[]): Promise<PoolVolumeSnapshot[]> {
    let volumes: PoolVolumeSnapshot[] = [];
    let requestUrl = `${API_URL}/Volume/GetVolumeForAllPools`
    for (let i = 0; i < intervals.length - 1; i++) {
        let queryParams = new URLSearchParams({
            start: `${intervals[i]}`,
            end: `${intervals[i + 1]}`,
        })
        const response = await fetch(`${requestUrl}?${queryParams}`);
        const rawRes = await response.json();
        volumes.push(
            new PoolVolumeSnapshot(
                intervals[i],
                intervals[i+1],
                PoolVolume.fromServerResponse(rawRes)));
    }

    return volumes
}

export async function getPoolsForTokenPair(tokenPair: TokenPair): Promise<LP[]> {
    let pools: LP[] = [];
    let requestUrl = `${API_URL}/Utilities/GetPoolForTokens`
    let queryParams = new URLSearchParams({
        token0: tokenPair.tokenIn.address,
        token1: tokenPair.tokenOut.address
    })
    const url = `${requestUrl}?${queryParams}`
    const response = await fetch(url);
    const rawRes = await response.json();

    rawRes.forEach((poolAddress: any) => {
        if (poolAddress.startsWith('0x00000')) return
        pools.push(new LP(poolAddress, tokenPair))
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

// Should be in seconds
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
export async function getLPInfoWithBlock(lp: LP, blockNumber: number): Promise<LPSnapshot> {
    let requestUrl = `${API_URL}/LpInfo/GetLpInfoForBlock`
    let queryParams = new URLSearchParams({
        poolAddress: lp.address,
        blockNumber: `${blockNumber}`
    })

    const url = `${requestUrl}?${queryParams}`
    const response = await fetch(url);
    const rawRes = await response.json();
    const lpInfo = await LPInfo.LPInfoFromServerResponse(rawRes);

    // TODO: Fix this in backend
    if (lp.tokenPair.tokenOut.symbol === 'USDC') {
        // This is due to decimals of USDC
        lpInfo.tvlUSD = lpInfo.tvlUSD / 1000000
        // Don't know why but they are
        lpInfo.tvlUSD = lpInfo.tvlUSD / 100
    }
    const newLPSnapshot = new LPSnapshot(lp, lpInfo);
    return newLPSnapshot
}

export async function getLPInfosForBlockNumbers(lp: LP, blockNumbers: number[]): Promise<LPSnapshot[]> {
    const lpInfoInterval = await Promise.all(blockNumbers.map(async (blockNumber) => {
        // console.log(`Getting LP info for block ${blockNumber}`)
        return await getLPInfoWithBlock(lp, blockNumber);
    }))
    return lpInfoInterval
}

export async function getLPInfosForIntervals(lp: LP, intervals: number[]): Promise<LPSnapshot[]> {
    const blockNumbers = await getBlockIntervals(intervals);
    const lpInfoInterval = await Promise.allSettled(blockNumbers.map(async (blockNumber) => {
        return await getLPInfoWithBlock(lp, blockNumber);
    }))

    const res = lpInfoInterval.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    return res
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

export async function getSwapsCount(intervals: number[]): Promise<number[]> {
    const numbers = []
    for (let i = 0; i < intervals.length - 1; i++) {
        let requestUrl = `${API_URL}/Slippage/CountAllSlippages`
        let queryParams = new URLSearchParams({
            start: intervals[i].toString(),
            end: intervals[i + 1].toString(),
        })

        const url = `${requestUrl}?${queryParams}`
        const response = await fetch(url);
        const rawRes = await response.json();
        numbers.push(rawRes)
    }
    return numbers
}

export async function getImpermanentLoss(intervals: number[]): Promise<ImpermanentLossSnapshot[]> {
    const snapshots = []
    for (let i = 0; i < intervals.length - 1; i++) {
        // https://test.xtreamly.io:5000/api/v1/ImpermanentLoss/CalculateForAllAddresses?startTime=1712835245000&endTime=1712928135608
        await new Promise(r => setTimeout(r, 100));
        
        try {
            let requestUrl = `${API_URL}/ImpermanentLoss/GetForAllPools`
            // Takes millisecond
            const startTime = intervals[i] * 1000
            const endTime = intervals[i + 1] * 1000
            let queryParams = new URLSearchParams({
                startTime: startTime.toString(),
                endTime: endTime.toString(),
            })
            const url = `${requestUrl}?${queryParams}`
            const response = await fetch(url);
            const rawRes = await response.json();
            const ILSnapshot = ImpermanentLossSnapshot.fromServerResponse(rawRes, startTime, endTime);
            snapshots.push(ILSnapshot)
        } catch (e) {
            console.log(e)
        }
    }
    return snapshots
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


export async function predictSlippageForSwaps(transactionHashes: string[]): Promise<Record<string, number>> {
    const url = `${API_URL}/Slippage/CalculateHistoricalSlippage`
    const body = JSON.stringify(transactionHashes)
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const rawRes = await response.json();
    // console.log(Object.keys(rawRes).length)
    return rawRes
}
