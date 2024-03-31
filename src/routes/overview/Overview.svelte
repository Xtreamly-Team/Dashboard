<script lang="ts">
    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import { onMount } from "svelte";
    import TransactionCard from "./TransactionCard.svelte";
    import {
    TokenPair,
        type SwapTransaction,
        type TokenVolume,
        type TokenVolumesSnapshot,
        type LPInfo,
        LPSnapshot,
        AggergatedSlippageAmount,
    } from "$lib/models/models";
    import {
    getBlockIntervals,
        getIntervalDates,
        getLatestBlock,
        getPreviousDaysStart,
        getPreviousWeeksStart,
        getSupportedTokens,
        StableCoins,
        timestampToDate,
        truncateNumber,
    } from "$lib/utils";
    import { getBlockForTimestamp, getLPInfosForBlockNumbers, getLPInfosForIntervals, getPoolsForTokenPair, getSlippageAmountForIntervals, getSwapTransactions, getVolatilityForIntervals, getVolumeForAllTokens } from "$lib/api";
    import TransactionsTable from "$lib/components/dashboard/TransactionsTable.svelte";
    import type { SimpleDataPoint } from "$lib/charts";
    import { Card } from "flowbite-svelte";
    import DataCard from "$lib/components/DataCard.svelte";

    let tvlData = [
        // {x: 'apple', y: 10},
        // {x: 'orange', y: 16}
        { x: "05/06/2014", y: 100 },
        { x: "05/07/2014", y: 101 },
        { x: "05/08/2014", y: 102 },
        { x: "05/09/2014", y: 105 },
        { x: "05/10/2014", y: 99 },
        { x: "05/11/2014", y: 102 },
        { x: "05/12/2014", y: 95 },
        { x: "05/13/2014", y: 100 },
        { x: "05/14/2014", y: 101 },
        { x: "05/15/2014", y: 149 },
        { x: "05/16/2014", y: 95 },
        { x: "05/17/2014", y: 99 },
        { x: "05/18/2014", y: 105 },
        { x: "05/19/2014", y: 95 },
        { x: "05/20/2014", y: 100 },
        { x: "05/21/2014", y: 109 },
        { x: "05/22/2014", y: 102 },
        { x: "05/23/2014", y: 6 },
        { x: "05/24/2014", y: 84 },
        { x: "05/25/2014", y: 109 },
        { x: "05/26/2014", y: 95 },
    ];

    let tvlSeries = {
        name: "TVL",
        type: "area",
        data: tvlData,
    };

    let positiveSlippageData = [
        { x: "05/06/2014", y: 6 },
        { x: "05/07/2014", y: 18 },
        { x: "05/08/2014", y: 2 },
        { x: "05/09/2014", y: 1 },
        { x: "05/10/2014", y: 1 },
        { x: "05/11/2014", y: 6 },
        { x: "05/12/2014", y: 3 },
        { x: "05/13/2014", y: 4 },
        { x: "05/14/2014", y: 4 },
        { x: "05/15/2014", y: 9 },
        { x: "05/16/2014", y: 8 },
        { x: "05/17/2014", y: 15 },
        { x: "05/18/2014", y: 6 },
        { x: "05/19/2014", y: 30 },
        { x: "05/20/2014", y: 10 },
        { x: "05/21/2014", y: 7 },
        { x: "05/22/2014", y: 4 },
        { x: "05/23/2014", y: 5 },
        { x: "05/24/2014", y: 6 },
        { x: "05/25/2014", y: 2 },
        { x: "05/26/2014", y: 3 },
    ];

    let positiveSlippageSeries = {
        name: "Positive Slippage",
        type: "line",
        data: positiveSlippageData,
    };

    let negativeSlippageData = [
        { x: "05/06/2014", y: 10 },
        { x: "05/07/2014", y: 10 },
        { x: "05/08/2014", y: 10 },
        { x: "05/09/2014", y: 10 },
        { x: "05/10/2014", y: 9 },
        { x: "05/11/2014", y: 10 },
        { x: "05/12/2014", y: 9 },
        { x: "05/13/2014", y: 10 },
        { x: "05/14/2014", y: 10 },
        { x: "05/15/2014", y: 14 },
        { x: "05/16/2014", y: 9 },
        { x: "05/17/2014", y: 9 },
        { x: "05/18/2014", y: 10 },
        { x: "05/19/2014", y: 95 },
        { x: "05/20/2014", y: 10 },
        { x: "05/21/2014", y: 11 },
        { x: "05/22/2014", y: 10 },
        { x: "05/23/2014", y: 6 },
        { x: "05/24/2014", y: 8 },
        { x: "05/25/2014", y: 10 },
        { x: "05/26/2014", y: 9 },
    ];

    let negativeSlippageSeries = {
        name: "Negative Slippage",
        type: "line",
        data: negativeSlippageData,
    };

    let volatilityData = [
        { x: "05/06/2014", y: 33 },
        { x: "05/14/2014", y: 45 },
    ];

    let volatilitySeries = {
        name: "Volatility",
        type: "line",
        color: "#EE6D7A",
        data: volatilityData,
    };

    let impermanentLossData = [
        { x: "05/06/2014", y: 100 },
        { x: "05/09/2014", y: 101 },
    ];

    let impermanentLossSeries = {
        name: "Impermanent Loss",
        type: "line",
        data: impermanentLossData,
    };

    // TODO: Maybe add annotations
    let overviewSeries: ApexAxisChartSeries | undefined = undefined;

    let overviewFillOptions = {
        type: ["gradient", "solid", "solid", "solid"],
        // type: 'gradient',
        gradient: {
            shadeIntensity: 0.5,
            type: "vertical",
            shade: "dark",
            // inverseColors: false,
            opacityFrom: [0.55, 1, 1, 0.8],
            opacityTo: [0.35, 1, 1, 0.8],
            // stops: [0, 100]
        },
    };

    let swapTransactions: SwapTransaction[] = [];

    function priceImpactChartData(swapTransactions: SwapTransaction[]) {
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
                    y: +truncateNumber(swap.priceImpactPercentage),
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

    let priceImpactSeries: ApexAxisChartSeries | undefined = undefined;

    let volumeData = [
        { x: "05/06/2014", y: 100 },
        { x: "05/07/2014", y: 89 },
        { x: "05/08/2014", y: 79 },
        { x: "05/09/2014", y: 94 },
        { x: "05/10/2014", y: 99 },
        { x: "05/11/2014", y: 102 },
        { x: "05/12/2014", y: 95 },
        { x: "05/13/2014", y: 82 },
        { x: "05/14/2014", y: 8 },
        { x: "05/15/2014", y: 149 },
        { x: "05/16/2014", y: 95 },
        { x: "05/17/2014", y: 99 },
        { x: "05/18/2014", y: 85 },
        { x: "05/19/2014", y: 59 },
        { x: "05/20/2014", y: 84 },
        { x: "05/21/2014", y: 82 },
        { x: "05/22/2014", y: 69 },
        { x: "05/23/2014", y: 6 },
        { x: "05/24/2014", y: 71 },
        { x: "05/25/2014", y: 91 },
        { x: "05/26/2014", y: 95 },
    ];

    function getTokenVolumeSeries(volumeSnapshots: TokenVolumesSnapshot[]) {

        const volumeData = volumeSnapshots.map((snapshot) => {
            return {
                x: timestampToDate(snapshot.timestamp).toDateString(),
                y: truncateNumber(snapshot.tokenVolumes.reduce((acc, tokenVolume) => {
                    if (StableCoins.includes(tokenVolume.tokenSymbol.toUpperCase())) {
                        return acc + tokenVolume.totalVolume;
                    } else {
                        return acc;
                    }
                }, 0), 0),
            };
        });

        let volumeSeries = {
            name: "Volume",
            type: "bar",
            data: volumeData,
        };

        return volumeSeries;
    }

    function getTVLSeries(lpSnapshots: LPSnapshot[]) {

        // const tvlData = lpSnapshots.map((snapshot) => {
        //     return {
        //         x: timestampToDate(snapshot.info.).toDateString(),
        //         y: truncateNumber(snapshot.tokenVolumes.reduce((acc, tokenVolume) => {
        //             if (StableCoins.includes(tokenVolume.tokenSymbol.toUpperCase())) {
        //                 return acc + tokenVolume.totalVolume;
        //             } else {
        //                 return acc;
        //             }
        //         }, 0), 0),
        //     };
        // });
        //
        // let volumeSeries = {
        //     name: "Volume",
        //     type: "bar",
        //     data: tvlData,
        // };
        //
        // return volumeSeries;
    }

    onMount(async () => {
        const [WETH, USDT, USDC, DAI] = getSupportedTokens()

        const pastWeekIntervals = getPreviousDaysStart(7);
        const pastWeekBlockIntervals = await getBlockIntervals(pastWeekIntervals);
        const pastWeekIntervalDays = getIntervalDates(pastWeekIntervals);


        const pastMonthIntervals = getPreviousDaysStart(3);
        const pastMonthblockIntervals = await getBlockIntervals(pastMonthIntervals);
        const pastMonthIntervalDays = getIntervalDates(pastMonthIntervals);


        console.log(pastMonthIntervals);


        const tokenVolumes = []

        const lps = await getPoolsForTokenPair(new TokenPair(WETH, USDT))

        console.log(lps)


        console.log(pastMonthblockIntervals)

        // const lpInfos = await getLPInfosForBlockNumbers(lps[1], blockIntervals.slice(0, 1))
        //
        // console.log(lpInfos)

        // const volumeSeries = getTokenVolumeSeries(tokenVolumes);
        //
        // console.log(tokenVolumes);
        //
        // const weekIntervals = getPreviousWeeksStart(slippageIntervalWeeks);


        const aggregatedSlippageAmount = await getSlippageAmountForIntervals(pastMonthIntervals)

        const positiveSlippageData = aggregatedSlippageAmount.map((slippageAmount: AggergatedSlippageAmount) => {
            return {
                x: timestampToDate(slippageAmount.timestamp).toDateString(),
                y: slippageAmount.positiveSlippage
            };
        });

        const negativeSlippageData = aggregatedSlippageAmount.map((slippageAmount: AggergatedSlippageAmount) => {
            return {
                x: timestampToDate(slippageAmount.timestamp).toDateString(),
                y: slippageAmount.negativeSlippage
            };
        });

        const positiveSlippageSeries = {
            name: "Positive Slippage",
            type: "line",
            data: positiveSlippageData,
        };

        const negativeSlippageSeries = {
            name: "Negative Slippage",
            type: "line",
            data: negativeSlippageData,
        };



        overviewSeries = [
            // tvlSeries,
            // positiveSlippageSeries,
            // negativeSlippageSeries,
            // volumeSeries,
            // volatilitySeries,
            // impermanentLossSeries,
        ];


        const currentDayStart = pastWeekIntervals[0];

        const currentTime = Math.floor(new Date().valueOf() / 1000);

        swapTransactions = await getSwapTransactions(
            currentDayStart,
            currentTime,
            1000,
        );

        priceImpactSeries = priceImpactChartData(swapTransactions);
    });
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn title="Number of swaps (Last 24 hours)" value="24512">
            <FactColumnItem title="TVL (Last 24 hours)" value="$144.618b" />
            <FactColumnItem
                title="Total Volume (Last 24 hours)"
                value="$144.618b"
            />
            <FactColumnItem
                title="Total Positive Slippage (Last 24 hours)"
                value="$122.618b"
            />
            <FactColumnItem
                title="Total Negative Slippage (Last 24 hours)"
                value="$144.618b"
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if overviewSeries != undefined}
                    <TemporalChart
                        dataSeries={overviewSeries}
                        fillOptions={overviewFillOptions}
                    />
                {/if}
                {#if priceImpactSeries != undefined}
                    <XyChart
                        dataSeries={priceImpactSeries}
                        xaxisTitle="Amount In"
                        yaxisTitle="Price Impact"
                    />
                {/if}
            </div>
        </div>
    </div>
</DataCard>
<TransactionsTable {swapTransactions} />
