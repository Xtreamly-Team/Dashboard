<script lang="ts">
    import DataCard from "$lib/components/DataCard.svelte";
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import PieChart from "$lib/components/dashboard/PieChart.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import { AggregatedSlippageAmount, PoolVolatilitiesSnapshot, SwapTransaction, TokenVolumesSnapshot, type LPRegistry } from "$lib/models";
    import { slippageChartData } from "$lib/process";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    let swapTransactions =
 getContext<Writable<SwapTransaction[]>>("swapTransactions");
    let slippageCount = getContext<Writable<number[]>>("slippageCount");
    let aggregatedSlippages = getContext<Writable<AggregatedSlippageAmount[]>>(
        "aggregatedSlippages",
    );
    let tokenVolumesSnapshots = getContext<Writable<TokenVolumesSnapshot[]>>(
        "tokenVolumesSnapshots",
    );
    let poolVolatilitySnapshots = getContext<
        Writable<PoolVolatilitiesSnapshot[]>
    >("poolVolatilitySnapshots");
    let lpRegistry = getContext<Writable<LPRegistry>>("lpRegistry");

    $: last24HoursPositiveSlippage = Math.floor(
        [...$aggregatedSlippages].pop()?.positiveSlippage / 1000,
    );
    $: last24HoursNegativeSlippage = Math.floor(
        [...$aggregatedSlippages].pop()?.negativeSlippage / 1000,
    );

    $: todayTrasnactionsWithNegativeSlipapge = $swapTransactions.filter(
        (transaction) => transaction.slippageAmount < 0,
    );

    $: todayTransactionsWithPositiveSlippage = $swapTransactions.filter(
        (transaction) => transaction.slippageAmount > 0,
    );

    $: numberOfTodayTransactions = $swapTransactions.length;


    $: positiveSlippageData = slippageChartData($aggregatedSlippages, true);
    $: positiveSlippageSeries = {
        name: "Positive Slippage",
        type: "line",
        data: positiveSlippageData,
    };

    $: negativeSlippageData = slippageChartData($aggregatedSlippages, false);
    $: negativeSlippageSeries = {
        name: "Negative Slippage",
        type: "line",
        data: negativeSlippageData,
    };

    $: slippagePieChartData = [
        $aggregatedSlippages.reduce(
            (acc, slippage) => acc + slippage.positiveSlippage,
            0,
        ),
        $aggregatedSlippages.reduce(
            (acc, slippage) => acc + slippage.negativeSlippage,
            0,
        ),
    ];

</script>

<DataCard title="Slippage">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn
            title="Today total loss due to slippage"
            value={`$${last24HoursNegativeSlippage.toFixed(0)}K`}
        >
            <FactColumnItem
                title="Total Positive Slippage (Last 24 hours)"
                value={`$${last24HoursPositiveSlippage?.toFixed(0)}K`}
            />
            <FactColumnItem
                title="Total Negative Slippage (Last 24 hours)"
                value={`$${last24HoursNegativeSlippage?.toFixed(0)}K`}
            />
            <FactColumnItem
                title="Percentage of transactions with negative slippage"
                value={`$${(
                    (todayTrasnactionsWithNegativeSlipapge.length * 100) /
                    numberOfTodayTransactions
                )?.toFixed(2)}%`}
            />
            <FactColumnItem
                title="Percentage of transactions with positive slippage"
                value={`$${(
                    (todayTransactionsWithPositiveSlippage.length * 100) /
                    numberOfTodayTransactions
                )?.toFixed(2)}%`}
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if slippagePieChartData != undefined}
                    <TemporalChart
                        dataSeries={[
                            positiveSlippageSeries,
                            negativeSlippageSeries,
                        ]}
                    />
                    <PieChart
                        dataSeries={slippagePieChartData}
                        labels={["Positive Slippage", "Negative Slippage"]}
                    />
                {/if}
            </div>
        </div>
    </div>
</DataCard>
