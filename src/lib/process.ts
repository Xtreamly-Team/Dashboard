import { PoolVolatilitiesSnapshot, type AggregatedSlippageAmount, type LPRegistry, type LPSnapshot, type SwapTransaction, TokenVolumesSnapshot } from "./models";
import { LP_USDC, LP_USDT, StableCoins, timestampToDate, truncateNumber } from "./utils";

export const applyRatio = (data, ratio) => {
    return data.map((point: { x: any; y: number; }) => {
        return {
            x: point.x,
            y: point.y * ratio,
        };
    });
}

export function priceImpactChartData(swapTransactions: SwapTransaction[]) {
    let ethData = [];
    let usdtData = [];
    let usdcData = [];
    for (let swap of swapTransactions) {
        if (swap.tokenInSymbol === "WETH") {
            ethData.push({
                x: swap.amountIn,
                y: +truncateNumber(swap.priceImpactPercentage),
            });
        } else if (swap.tokenInSymbol === "USDT") {
            usdtData.push({
                x: swap.amountIn,
                y: +truncateNumber(swap.priceImpactPercentage),
            });
        } else if (swap.tokenInSymbol === "USDC") {
            usdcData.push({
                x: swap.amountIn,
                // TODO: URGENT: fix this in the backend
                y: -1 * (+truncateNumber(swap.priceImpactPercentage))
            });
        }
    }
    let dataSeries = [
        // {
        //     name: "ETH",
        //     type: "scatter",
        //     data: ethData,
        // },
        {
            name: "USDT",
            type: "scatter",
            data: usdtData,
        },
        {
            name: "USDC",
            type: "scatter",
            data: usdcData,
        },
    ];
    return dataSeries;
}

// Here we're assuming that volume is always in stablecoins since we're only interested in the usd value.
export function aggregateVolumeChartData(tokenVolumeSnapshots: TokenVolumesSnapshot[],
    flowType: "in" | "out" | "total" = "total") {
    // TODO: Make sure it is independantly scaled from other chart parts
    const points = []
    for (const snapshot of tokenVolumeSnapshots) {
        let totalVolume = 0
        for (const tokenVolume of snapshot.tokenVolumes) {
            if (StableCoins.includes(tokenVolume.tokenSymbol.toUpperCase())) {
                if (flowType === "in") {
                    totalVolume += tokenVolume.volumeIn
                } else if (flowType === "out") {
                    totalVolume += tokenVolume.volumeOut
                } else {
                    totalVolume += tokenVolume.totalVolume
                }
            }
            points.push({
                x: timestampToDate(snapshot.timestamp),
                y: Math.floor(totalVolume),
            })
        }
    }
    return points
}

export function volumePerTokenChartData(tokenVolumeSnapshots: TokenVolumesSnapshot[], tokenSymbol: string) {
    return tokenVolumeSnapshots.map((snapshot) => {
        return {
            x: timestampToDate(snapshot.timestamp),
            y: snapshot.tokenVolumes.find((tokenVolume) => tokenVolume.tokenSymbol === tokenSymbol)
        }
    })
}

export function calculateAggregateTVL(lpRegistry: LPRegistry) {
    if (Object.keys(lpRegistry).length == 0) {
        return []
    }
    let aggregateTVL = new Array(lpRegistry[Object.keys(lpRegistry)[0]].length).fill(0);
    for (const address in lpRegistry) {
        const snapshots = lpRegistry[address]
        const tvls = snapshots.map((snapshot: LPSnapshot) =>
            snapshot.info.tvlUSD,
        )
        tvls.forEach((tvl, i) => {
            aggregateTVL[i] = aggregateTVL[i] + tvl;
        })
    }
    return aggregateTVL
}

export function calculateAggregateLiquidity(lpRegistry: LPRegistry) {
    if (Object.keys(lpRegistry).length == 0) {
        return []
    }
    let aggregateLiquidity = new Array(lpRegistry[Object.keys(lpRegistry)[0]].length).fill(0);
    for (const address in lpRegistry) {
        const snapshots = lpRegistry[address]
        const liquidities = snapshots.map((snapshot: LPSnapshot) =>
            snapshot.info.liquidity,
        )
        liquidities.forEach((liquidity, i) => {
            aggregateLiquidity[i] = aggregateLiquidity[i] + liquidity;
        })
    }
    return aggregateLiquidity
}
export function liquidityChartData(lpRegistry: LPRegistry) {
    let data = [];
    let aggregateLiquidity = calculateAggregateLiquidity(lpRegistry)
    if (!aggregateLiquidity) {
        return []
    }
    if (aggregateLiquidity.length == 0) {
        return []
    }
    const timestamps = lpRegistry[Object.keys(lpRegistry)[0]].map((snapshot: LPSnapshot) => snapshot.info.timestamp!)
    // TODO: Make sure it is independantly scaled from other chart parts
    for (let i = 0; i < aggregateLiquidity.length; i++) {
        data.push({
            x: timestampToDate(timestamps[i]),
            y: Math.floor(aggregateLiquidity[i]),
        });
    }
    return data
}

export function tvlChartData(lpRegistry: LPRegistry) {
    let data = [];
    let aggregateTVL = calculateAggregateTVL(lpRegistry)
    console.log(lpRegistry)
    console.log("TVC CHART DATA")
    console.log(aggregateTVL)
    if (!aggregateTVL) {
        return []
    }
    if (aggregateTVL.length == 0) {
        return []
    }
    const timestamps = lpRegistry[Object.keys(lpRegistry)[0]].map((snapshot: LPSnapshot) => snapshot.info.timestamp!)
    // TODO: Make sure it is independantly scaled from other chart parts
    for (let i = 0; i < aggregateTVL.length; i++) {
        data.push({
            x: timestampToDate(timestamps[i]),
            y: Math.floor(aggregateTVL[i]),
        });
    }
    return data
}

export function slippageChartData(aggregatedSlippages: AggregatedSlippageAmount[], positive = true) {
    return aggregatedSlippages.map((slippageAmount) => {
        return {
            x: timestampToDate(slippageAmount.timestamp),
            y: positive ? slippageAmount.positiveSlippage : slippageAmount.negativeSlippage,
        };
    });
}

export function aggregateAverageVolatilityChartData(volatilitySnapshots: PoolVolatilitiesSnapshot[]) {
    let averageVolatilityData: number[] = []
    volatilitySnapshots.forEach((snapshot, j) => {
        averageVolatilityData.push(snapshot.averageVolatility)
    })

    return volatilitySnapshots.map((snapshot, i) => {
        return {
            x: timestampToDate(snapshot.timestamp),
            y: averageVolatilityData[i],
        };
    })

}

export function aggregateAverageATRVolatilityChartData(volatilitySnapshots: PoolVolatilitiesSnapshot[]) {
    let averageVolatilityData: number[] = []
    volatilitySnapshots.forEach((snapshot, j) => {
        averageVolatilityData.push(snapshot.averageATR)
    })

    return volatilitySnapshots.map((snapshot, i) => {
        return {
            x: timestampToDate(snapshot.timestamp),
            y: averageVolatilityData[i],
        };
    })

}

export function aggregateAverageVarianceChartData(volatilitySnapshots: PoolVolatilitiesSnapshot[]) {
    let averageVolatilityData: number[] = []
    volatilitySnapshots.forEach((snapshot, j) => {
        averageVolatilityData.push(snapshot.averageVariance)
    })

    return volatilitySnapshots.map((snapshot, i) => {
        return {
            x: timestampToDate(snapshot.timestamp),
            y: averageVolatilityData[i],
        };
    })

}

export function getTokenVolumeData(volumeSnapshots: TokenVolumesSnapshot[]) {
    const volumeData = volumeSnapshots.map((snapshot) => {
        return {
            x: timestampToDate(snapshot.timestamp).toDateString(),
            y: truncateNumber(
                snapshot.tokenVolumes.reduce((acc, tokenVolume) => {
                    if (
                        StableCoins.includes(
                            tokenVolume.tokenSymbol.toUpperCase(),
                        )
                    ) {
                        return acc + tokenVolume.totalVolume;
                    } else {
                        return acc;
                    }
                }, 0),
                0,
            ),
        };
    });

    return volumeData;

}

export function splitLPRegistry(lpRegistry: LPRegistry) {
    const usdtRegistry: LPRegistry = {}
    const usdcRegistry:LPRegistry = {}
    for (const address in lpRegistry) {
        if (LP_USDT.includes(address.toLowerCase())) {
            usdtRegistry[address] = lpRegistry[address]
        }
        else if (LP_USDC.includes(address.toLowerCase())) {
            usdcRegistry[address] = lpRegistry[address]
        }

    }
    const res = [ usdtRegistry, usdcRegistry ]
    console.log("Returning result")
    console.log(res)
    return res
}

export function splitPoolVolatilitySnapshots(poolVolatilitySnapshots: PoolVolatilitiesSnapshot[]) {
    const usdtSnapshots: PoolVolatilitiesSnapshot[] = []
    const usdcSnapshots: PoolVolatilitiesSnapshot[] = []
    for (const snapshot of poolVolatilitySnapshots) {
        const usdtPoolVolatilities = snapshot.poolVolatilities.filter((poolVolatility) => LP_USDT.includes(poolVolatility.poolAddress.toLowerCase()))
        const usdcPoolVolatilities = snapshot.poolVolatilities.filter((poolVolatility) => LP_USDC.includes(poolVolatility.poolAddress.toLowerCase()))
        usdtSnapshots.push(new PoolVolatilitiesSnapshot(snapshot.timestamp, usdtPoolVolatilities))
        usdcSnapshots.push(new PoolVolatilitiesSnapshot(snapshot.timestamp, usdcPoolVolatilities))
    }
    const res = [ usdtSnapshots, usdcSnapshots ]
    return res
}

export function splitTokenVolumeSnapshots(tokenVolumeSnapshots: TokenVolumesSnapshot[]) {
    const usdtSnapshots: TokenVolumesSnapshot[] = []
    const usdcSnapshots: TokenVolumesSnapshot[] = []
    const ethSnapshots: TokenVolumesSnapshot[] = []
    for (const snapshot of tokenVolumeSnapshots) {
        const usdtTokenVolumes = snapshot.tokenVolumes.filter((tokenVolume) => ['usdt'].includes(tokenVolume.tokenSymbol.toLowerCase()))
        const usdcTokenVolumes = snapshot.tokenVolumes.filter((tokenVolume) => ['usdc'].includes(tokenVolume.tokenSymbol.toLowerCase()))
        const ethTokenVolumes = snapshot.tokenVolumes.filter((tokenVolume) => ['eth'].includes(tokenVolume.tokenSymbol.toLowerCase()))
        usdtSnapshots.push(new TokenVolumesSnapshot(snapshot.timestamp, usdtTokenVolumes))
        usdcSnapshots.push(new TokenVolumesSnapshot(snapshot.timestamp, usdcTokenVolumes))
        ethSnapshots.push(new TokenVolumesSnapshot(snapshot.timestamp, ethTokenVolumes))
    }
    const res = [ usdtSnapshots, usdcSnapshots, ethSnapshots ]
    return res
}
