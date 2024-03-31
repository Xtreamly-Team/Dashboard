<script lang="ts">
    import { startReceivingCeXonWebsocket } from "$lib/api";
    import DataCard from "$lib/components/DataCard.svelte";

    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import { timestampToDate } from "$lib/utils";
    import { onMount } from "svelte";

    // TODO: Make dates contain seconds

    let chartReady = false

    let DEXPrice = [
        // {x: 'apple', y: 10},
        // {x: 'orange', y: 16}
        { x: "05/06/2014", y: 4000 },
        { x: "05/07/2014", y: 4105 },
        { x: "05/08/2014", y: 4094 },
        { x: "05/09/2014", y: 4101 },
        { x: "05/10/2014", y: 4124 },
        { x: "05/11/2014", y: 4079 },
        { x: "05/12/2014", y: 4119 },
    ];

    let DexPriceSeries = {
        name: "DEX",
        type: "line",
        data: DEXPrice,
    };

    let CeXPriceData = [
        // { x: "05/06/2014", y: 4002 },
        // { x: "05/07/2014", y: 4104 },
        // { x: "05/08/2014", y: 4089 },
        // { x: "05/09/2014", y: 4102 },
        // { x: "05/10/2014", y: 4137 },
        // { x: "05/11/2014", y: 4072 },
        // { x: "05/12/2014", y: 4120 },
    ];

    $: CEXPriceSeries = {
        name: "CEX",
        type: "line",
        data: CeXPriceData,
    };

    // TODO: Maybe add annotations
    $: DEXCEXSeries = [
        // DexPriceSeries, 
        CEXPriceSeries
    ];

    onMount(async () => {
        await startReceivingCeXonWebsocket(async (trades) => {
            console.log(trades);
            const newPoints = trades.map((trade, a, b) => {
                const arbitaryDate = timestampToDate(trade.timestamp / 1000);
                arbitaryDate.setDate(a)
                return {
                    x: arbitaryDate.toDateString(),
                    y: trade.price,
                };
            });
            CeXPriceData = [...CeXPriceData, ...newPoints]
            console.log(CeXPriceData)
        });
        chartReady = true
    });
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn title="Average Difference" value="1.05%">
            <FactColumnItem title="ETH (Uniswap)" value="4046" />
            <FactColumnItem title="ETH (Binance)" value="4047.5" />
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
