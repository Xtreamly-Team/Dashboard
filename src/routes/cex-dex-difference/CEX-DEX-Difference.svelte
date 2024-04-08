<script lang="ts">
    import { getSwapTransactions, startReceivingCeXonWebsocket } from "$lib/api";
    import DataCard from "$lib/components/DataCard.svelte";

    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import type { SwapTransaction } from "$lib/models";
    import { StableCoins, getCurrentTime, timestampToDate } from "$lib/utils";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";

    // let swapTransactions = getContext<Writable<SwapTransaction[]>>("swapTransactions");

    // TODO: Make dates contain seconds

    let chartReady = false

    let lastUpdatedCEXTimestamp = 0
    let lastUpdatedDEXTimestamp = 0

    let latestDEXPrice = 0
    let latestCEXPrice = 0

    $: differnecePercentage = latestDEXPrice ? Math.abs(((latestCEXPrice - latestDEXPrice) / latestDEXPrice)) * 100 : 0;

    // let DEXPrice = [
    //     // {x: 'apple', y: 10},
    //     // {x: 'orange', y: 16}
    //     { x: "05/06/2014", y: 4000 },
    //     { x: "05/07/2014", y: 4105 },
    //     { x: "05/08/2014", y: 4094 },
    //     { x: "05/09/2014", y: 4101 },
    //     { x: "05/10/2014", y: 4124 },
    //     { x: "05/11/2014", y: 4079 },
    //     { x: "05/12/2014", y: 4119 },
    // ];

    // $: DEXPriceData = $swapTransactions.length ? $swapTransactions.map((transaction) => {
    //     return {
    //         x: transaction.timestamp,
    //         y: transaction.executedPrice
    //     };
    // }) : [];

    let DEXPriceData = []


    $: DexPriceSeries = {
        name: "DEX",
        type: "line",
        data: DEXPriceData,
    };

    let CeXPriceData = [];

    $: CEXPriceSeries = {
        name: "CEX",
        type: "line",
        data: CeXPriceData,
    };

    // TODO: Maybe add annotations
    $: DEXCEXSeries = [
        DexPriceSeries, 
        CEXPriceSeries
    ];

    onMount(async () => {
        await startReceivingCeXonWebsocket(async (trades) => {
            // console.log($swapTransactions)
                
            //     .map((transaction) => {
            //     return {
            //         x: transaction.timestamp,
            //         y: transaction.executedPrice
            //     };
            // }) : [];
            const possibleNewTrade = trades.filter((trade) => trade.symbol === 'ETH-USDT' || trade.symbol === 'ETH-USDC')[0]
            if (possibleNewTrade.timestamp <= lastUpdatedCEXTimestamp) {
                return;
            }
            const newTrade = possibleNewTrade;
            lastUpdatedCEXTimestamp = newTrade.timestamp;
            latestCEXPrice = newTrade.price
            const newPoint = {
                // x: arbitaryDate.toDateString(),
                x: lastUpdatedCEXTimestamp,
                y: latestCEXPrice
            };
            CeXPriceData = [...CeXPriceData, newPoint];

            let swapTransactions = await getSwapTransactions(
                getCurrentTime() - 20,
                getCurrentTime(),
                10,
            );
            const possibleNewDexTrade = swapTransactions.filter((trade) => trade.timestamp - lastUpdatedDEXTimestamp > 3 && StableCoins.includes(trade.tokenOutSymbol)).at(0)
            console.log(possibleNewDexTrade)
            if (possibleNewDexTrade) {
                const newDexTrade = possibleNewDexTrade;
                lastUpdatedDEXTimestamp = newDexTrade.timestamp;
                latestDEXPrice = newDexTrade.quotedPrice
                const newDEXPoint = {
                    x: lastUpdatedDEXTimestamp * 1000,
                    y: latestDEXPrice,
                };
                DEXPriceData = [...DEXPriceData, newDEXPoint];

            }
        });
        chartReady = true
    });
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn title="Average Difference" value="${differnecePercentage.toFixed(2)}%">
            <FactColumnItem title="ETH (Uniswap)" value="$${latestDEXPrice.toFixed(1)}" />
            <FactColumnItem title="ETH (Binance)" value="$${latestCEXPrice.toFixed(1)}" />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if chartReady}
                    <TemporalChart dataSeries={DEXCEXSeries} />
                {/if}
            </div>
        </div>
    </div></DataCard
>
