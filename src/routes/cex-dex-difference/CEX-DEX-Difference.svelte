<script lang="ts">
    import {
        getSwapTransactions,
        startReceivingCeXonWebsocket,
    } from "$lib/api";
    import DataCard from "$lib/components/DataCard.svelte";

    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import { StableCoins, getCurrentTime, timestampToDate } from "$lib/utils";
    import { getContext, onMount } from "svelte";

    // TODO: Make dates contain seconds?

    let chartReady = false;

    let lastUpdatedCEXTimestamp = 0;
    let lastUpdatedDEXTimestamp = 0;

    let latestDEXPrice = 0;
    let latestCEXPrice = 0;

    $: differnecePercentage = latestDEXPrice
        ? Math.abs((latestCEXPrice - latestDEXPrice) / latestDEXPrice) * 100
        : 0;

    let DEXPriceData = [];

    $: DexPriceSeries = {
        name: "DEX (Uniswap)",
        type: "line",
        data: DEXPriceData,
    };

    let CeXPriceData = [];

    $: CEXPriceSeries = {
        name: "CEX (Binance)",
        type: "line",
        data: CeXPriceData,
    };

    // TODO: Maybe add annotations
    $: DEXCEXSeries = [DexPriceSeries, CEXPriceSeries];

    onMount(async () => {
        await startReceivingCeXonWebsocket(async (trades) => {
            const possibleNewTrade = trades.filter(
                (trade) =>
                    trade.symbol === "ETH-USDT" || trade.symbol === "ETH-USDC",
            )[0];
            if (possibleNewTrade.timestamp <= lastUpdatedCEXTimestamp) {
                return;
            }
            const newTrade = possibleNewTrade;
            lastUpdatedCEXTimestamp = newTrade.timestamp;
            latestCEXPrice = newTrade.price;
            const newPoint = {
                // x: arbitaryDate.toDateString(),
                x: lastUpdatedCEXTimestamp,
                y: latestCEXPrice,
            };
            CeXPriceData = [...CeXPriceData, newPoint];

            let swapTransactions = await getSwapTransactions(
                getCurrentTime() - 20,
                getCurrentTime(),
                10,
            );
            const possibleNewDexTrade = swapTransactions
                .filter(
                    (trade) =>
                        trade.timestamp - lastUpdatedDEXTimestamp > 3 &&
                        StableCoins.includes(trade.tokenOutSymbol),
                )
                .at(0);
            if (possibleNewDexTrade) {
                const newDexTrade = possibleNewDexTrade;
                lastUpdatedDEXTimestamp = newDexTrade.timestamp;
                latestDEXPrice = newDexTrade.quotedPrice;
                const newDEXPoint = {
                    x: lastUpdatedDEXTimestamp * 1000,
                    y: latestDEXPrice,
                };
                DEXPriceData = [...DEXPriceData, newDEXPoint];
            }
        });
        chartReady = true;
    });
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn>
            <FactColumnItem
                title="DEX-CEX price difference"
                value="${differnecePercentage.toFixed(2)}%"
            />
            <FactColumnItem
                title="ETH (Uniswap)"
                value="$${latestDEXPrice.toLocaleString()}"
            />
            <FactColumnItem
                title="ETH (Binance)"
                value="$${latestCEXPrice.toLocaleString()}"
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if chartReady}
                    <TemporalChart
                        title="ETH Price"
                        yaxisTitle="Price ($)"
                        xaxisTitle="Time"
                        dataSeries={DEXCEXSeries}
                    />
                {/if}
            </div>
        </div>
    </div></DataCard
>
