<script lang="ts">
    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import { onMount } from "svelte";
    import TransactionCard from "./TransactionCard.svelte";
    import type { SwapTransaction } from "$lib/models/models";
    import { getPreviousDaysStart, getPreviousWeeksStart, truncateNumber } from "$lib/utils";
    import { getSwapTransactions } from "$lib/api";
    import TransactionsTable from "$lib/components/dashboard/TransactionsTable.svelte";
    import type { SimpleDataPoint } from "$lib/charts";

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
    ];

    let tvlSeries = {
        name: "TVL",
        type: "line",
        data: tvlData,
    };

    let positiveSlippageData = [
        // { x: "05/06/2014", y: 30 },
        // { x: "05/08/2014", y: 55 },
        { x: "05/06/2014", y: 110 },
        { x: "05/07/2014", y: 101 },
        { x: "05/08/2014", y: 126 },
        { x: "05/09/2014", y: 91 },
        { x: "05/10/2014", y: 72 },
        { x: "05/11/2014", y: 73 },
        { x: "05/12/2014", y: 109 },
    ];

    let positiveSlippageSeries = {
        name: "Positive Slippage",
        type: "bar",
        data: positiveSlippageData,
    };

    let negativeSlippageData = [
        { x: "05/06/2014", y: 50 },
        { x: "05/07/2014", y: 60 },
        { x: "05/08/2014", y: 40 },
        { x: "05/09/2014", y: 30 },
        { x: "05/10/2014", y: 45 },
        { x: "05/11/2014", y: 70 },
        { x: "05/12/2014", y: 110 },
    ];

    let negativeSlippageSeries = {
        name: "Negative Slippage",
        type: "line",
        data: negativeSlippageData,
    };

    let volumeData = [
        { x: "05/06/2014", y: 200 },
        { x: "05/10/2014", y: 150 },
    ];

    let volumeSeries = {
        name: "Volume",
        type: "line",
        data: volumeData,
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
    let overviewSeries = [
        tvlSeries,
        positiveSlippageSeries,
        negativeSlippageSeries,
        volumeSeries,
        // volatilitySeries,
        // impermanentLossSeries,
    ];


    let swapTransactions: SwapTransaction[] = [];

    const slippageIntervalDays = 7;
    const slippageIntervalWeeks = 2;


    function priceImpactData(swapTransactions: SwapTransaction[]) {
        let ethData = [];
        let usdtData = [];
        let usdcData = [];
        for (let swap of swapTransactions) {
            if (swap.tokenInSymbol === 'WETH') {
                ethData.push({ x: swap.amountIn, y: swap.priceImpact });
            } else if (swap.tokenInSymbol === 'USDT') {
                usdtData.push({ x: swap.amountIn, y: swap.priceImpact });
            } else if (swap.tokenInSymbol === 'USDC') {
                usdcData.push({ x: swap.amountIn, y: swap.priceImpact });
            }
        }
        let dataSeries = [
            {
            name: 'ETH',
            type: 'scatter',
            data: ethData,
        },
            {
            name: 'USDT',
            type: 'scatter',
            data: usdtData
        },
            {
            name: 'USDC',
            type: 'scatter',
            data: usdcData
        },
        ]
        console.log(dataSeries);
        return dataSeries
    }


    let priceImpactSeries = undefined;

    // let priceImpactSeries = [
    //     {
    //         name: "Price Impact",
    //         type: "scatter",
    //         data: [
    //             { x: 20, y: 100 },
    //             { x: 10, y: 101 },
    //             { x: 15, y: 102 },
    //             { x: 22, y: 105 },
    //             { x: 31, y: 99 },
    //             { x: 12, y: 102 },
    //             { x: 14, y: 95 },
    //         ],
    //     },
    // ];


    onMount(async () => {
        const dayIntervals = getPreviousDaysStart(slippageIntervalDays);
        console.log(dayIntervals);
        const weekIntervals = getPreviousWeeksStart(slippageIntervalWeeks);
        console.log(weekIntervals);
        const currentDayStart = dayIntervals[0];
        const currentTime = Math.floor(new Date().valueOf() / 1000);
        console.log(currentDayStart, currentTime);

        swapTransactions = await getSwapTransactions(
            currentDayStart,
            currentTime,
            1000,
        );
        priceImpactSeries = priceImpactData(swapTransactions);

    });
</script>

<div
    class="w-full flex flex-wrap lg:flex-nowrap rounded-lg bg-white dark:bg-gray-600 p-4
border border-gray-200 dark:border-gray-600
    "
>
    <FactColumn title="Number of swaps" value="24512">
        <FactColumnItem title="TVL (Last 24 hours)" value="$144.618b" />
        <FactColumnItem title="Total Volume (Last 24 hours)" value="$144.618b" />
        <FactColumnItem title="Total Positive Slippage (Last 24 hours)" value="$122.618b" />
        <FactColumnItem title="Total Negative Slippage (Last 24 hours)" value="$144.618b" />
    </FactColumn>
    <div class="w-8" />
    <div class="w-full">
        <div class="flex flex-col">
            <TemporalChart dataSeries={overviewSeries} />
            {#if priceImpactSeries != undefined}
                <XyChart dataSeries={priceImpactSeries} xaxisTitle="Amount In" yaxisTitle="Price Impact"/>
                
            {/if}
        </div>
    </div>
</div>
<!-- <TransactionCard /> -->
<TransactionsTable {swapTransactions} />
