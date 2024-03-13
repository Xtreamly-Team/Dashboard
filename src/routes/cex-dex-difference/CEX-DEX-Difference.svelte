<script lang="ts">
    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";

    // TODO: Make dates contain seconds

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

    let CEXPrice = [
        { x: "05/06/2014", y: 4002 },
        { x: "05/07/2014", y: 4104 },
        { x: "05/08/2014", y: 4089 },
        { x: "05/09/2014", y: 4102 },
        { x: "05/10/2014", y: 4137 },
        { x: "05/11/2014", y: 4072 },
        { x: "05/12/2014", y: 4120 },
    ];

    let CEXPriceSeries = {
        name: "CEX",
        type: "line",
        data: CEXPrice,
    };

    // TODO: Maybe add annotations
    let DEXCEXSeries = [
        DexPriceSeries,
        CEXPriceSeries,
    ];

</script>

<div
    class="w-full flex flex-wrap lg:flex-nowrap rounded-lg bg-white dark:bg-gray-600 p-4
border border-gray-200 dark:border-gray-600
    "
>
    <FactColumn title="Average Difference" value="1.05%">
        <FactColumnItem title="ETH (Uniswap)" value="4046" />
        <FactColumnItem title="ETH (Binance)" value="4047.5" />
    </FactColumn>
    <div class="w-8" />
    <div class="w-full">
        <div class="flex flex-col">
            <TemporalChart dataSeries={DEXCEXSeries} />
        </div>
    </div>
</div>
