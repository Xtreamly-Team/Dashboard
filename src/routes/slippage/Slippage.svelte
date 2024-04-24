<script lang="ts">
    import DataCard from "$lib/components/DataCard.svelte";
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import PieChart from "$lib/components/dashboard/PieChart.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import { AggregatedSlippageAmount, PoolVolatilitiesSnapshot, SwapTransaction, TokenVolumesSnapshot, type LPRegistry, PoolVolumeSnapshot } from "$lib/models";
    import { slippageChartData, slippagePercentageToVolumeChangeChartSeries } from "$lib/process";
    import { truncateNumber } from "$lib/utils";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    let swapTransactions =
 getContext<Writable<SwapTransaction[]>>("swapTransactions");
    const universalTransactions = $swapTransactions.filter(
        (transaction) => transaction.thresholdPercentage,
    );

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
    let poolVolumeSnapshots = getContext<
        Writable<PoolVolumeSnapshot[]>
    >("poolVolumeSnapshots");
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

    $: slippageToThresholdScatteredData = universalTransactions.map((transaction) => {
        return {
            x: transaction.thresholdPercentage,
            y: transaction.slippageAmount,
        };
    });

    // TODO: Remove out of band data
    $: slippageToThresholdScatteredSeries = {
        name: "Slippage Percentage",
        type: "scatter",
        data: slippageToThresholdScatteredData,
    };

    const slippageThresholdFormatter = (value: number) => `${truncateNumber(value, 1)}%`;

    $: slippageToVolumeChangeChartSeries = slippagePercentageToVolumeChangeChartSeries($swapTransactions, $poolVolumeSnapshots)

</script>

<DataCard title="Slippage">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn>
            <FactColumnItem
            title="Today total loss due to slippage"
            value={`$${last24HoursNegativeSlippage.toLocaleString()}K`}
            />
            <FactColumnItem
                title="Total Positive Slippage (Last 24 hours)"
                value={`$${last24HoursPositiveSlippage?.toLocaleString()}K`}
            />
            <FactColumnItem
                title="Total Negative Slippage (Last 24 hours)"
                value={`$${last24HoursNegativeSlippage?.toLocaleString()}K`}
            />
            <FactColumnItem
                title="Percentage of transactions with negative slippage"
                value={`$${(
                    (todayTrasnactionsWithNegativeSlipapge.length * 100) /
                    numberOfTodayTransactions
                )?.toFixed(1)}%`}
            />
            <FactColumnItem
                title="Percentage of transactions with positive slippage"
                value={`$${(
                    (todayTransactionsWithPositiveSlippage.length * 100) /
                    numberOfTodayTransactions
                )?.toFixed(1)}%`}
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
                        title="Slippage Amount"
                        yaxisTitle="Slippage Amount ($)"
                        xaxisTitle="Date"
                        y_formatter={(value) => Math.floor(value).toLocaleString()}
                    />
                    <PieChart
                        title="Slippage Distribution"
                        dataSeries={slippagePieChartData}
                        labels={["Positive Slippage", "Negative Slippage"]}
                    />
                {/if}
                {#if slippageToThresholdScatteredData.length}
                    <XyChart
                      dataSeries={[slippageToThresholdScatteredSeries]}
                        title="Slippage to Threshold"
                        yaxisTitle="Actual Percentage (%)"
                        xaxisTitle="Slippage Tolerance (%)"
                        y_formatter={slippageThresholdFormatter}
                    />
                {/if}
                {#if slippagePercentageToVolumeChangeChartSeries.length}
                    <XyChart
                        dataSeries={slippageToVolumeChangeChartSeries}
                        title="Slippage to Volume Change"
                        yaxisTitle="Slippage Percentage (%)"
                        xaxisTitle="Volume Change (%)"
                    />
                {/if}
            </div>
        </div>
    </div>
</DataCard>
