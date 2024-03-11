<script lang="ts">
    import ChartWidget from "$lib/widgets/ChartWidget.svelte";
    import FactColumnItem from "./FactColumnItem.svelte";
    import OverviewChart from "./OverviewChart.svelte";
</script>

<div
    class="w-full flex flex-wrap lg:flex-nowrap rounded-lg bg-white dark:bg-gray-600 p-4
border border-gray-200 dark:border-gray-600
    "
>
    <div class="flex flex-col lg:min-w-96 w-96 m-4">
        <div class="font-thin text-lg">Total value locked</div>
        <div class="font-bold text-lg">$99.395b</div>
        <div class="flex flex-col gap-2 py-6">
            <FactColumnItem title="Total funding amount" value="$144.618b" />
            <FactColumnItem title="Total funding amount" value="$144.618b" />
            <FactColumnItem title="Total funding amount" value="$144.618b" />
        </div>
    </div>
    <div class="w-8"/>
    <div class="w-full">
	<OverviewChart/>
        <!-- <ChartWidget -->
        <!--     {chartOptions} -->
        <!--     title="Slippage Change" -->
        <!--     subtitle="Slippage change per block" -->
        <!-- /> -->
    </div>
</div>
