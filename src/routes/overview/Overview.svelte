<script lang="ts">
    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";
    import { getContext, onMount } from "svelte";
    import {
        TokenPair,
        SwapTransaction,
        type TokenVolume,
        type TokenVolumesSnapshot,
        type LPInfo,
        LPSnapshot,
        AggregatedSlippageAmount,
        type LPRegistry,
        PoolVolatilitiesSnapshot,
    } from "$lib/models";
    import { getSupportedTokens } from "$lib/utils";
    import DataCard from "$lib/components/DataCard.svelte";
    import {
        aggregateAverageATRVolatilityChartData,
        aggregateAverageVarianceChartData,
        aggregateAverageVolatilityChartData,
        aggregateVolumeChartData,
        applyRatio,
        calculateAggregateTVL,
        getTokenVolumeData,
        priceImpactChartData,
        slippageChartData,
        tvlChartData,
    } from "$lib/process";
    import type { Writable } from "svelte/store";
    import SwapTransactionsTable from "$lib/components/dashboard/SwapTransactionsTable.svelte";
    import MultiYaxisTemporalChart from "$lib/components/dashboard/MultiYaxisTemporalChart.svelte";

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

    $: last24HoursCount = $slippageCount.length
        ? $slippageCount.at(-1) ?? 0
        : 0;

    $: last24HoursTVL = Math.floor(
        calculateAggregateTVL($lpRegistry).pop() / 1_000_000,
    );

    $: last24HoursVolume = Math.floor(
        aggregateVolumeChartData($tokenVolumesSnapshots, "total").pop()?.y /
            1_000_000,
    );

    $: last24HoursPositiveSlippage = Math.floor(
        [...$aggregatedSlippages].pop()?.positiveSlippage / 1000,
    );
    $: last24HoursNegativeSlippage = Math.floor(
        [...$aggregatedSlippages].pop()?.negativeSlippage / 1000,
    );

    $: last24HoursVolatility = [...$poolVolatilitySnapshots].pop()
        ?.averageVolatility;

    $: thresholdTransactions = $swapTransactions.filter(
        (transaction) => transaction.thresholdPercentage,
    );

    $: priceImpactSeries = priceImpactChartData($swapTransactions);

    // TODO: Test tvl data after database is updated
    $: tvlDataSeries = {
        name: "TVL",
        type: "area",
        data: applyRatio(tvlChartData($lpRegistry), 1),
    };

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

    $: volumeData = aggregateVolumeChartData($tokenVolumesSnapshots, "total");

    $: volumeSeries = {
        name: "Volume",
        type: "bar",
        data: applyRatio(volumeData, 1),
    };

    // $: volatilityData = [
    //     { x: "05/06/2014", y: 33 },
    //     { x: "05/14/2014", y: 45 },
    // ];

    $: volatilitySeries = {
        name: "Volatility Standard Deviation",
        type: "line",
        // color: "#EE6D7A",
        data: applyRatio(
            aggregateAverageVolatilityChartData($poolVolatilitySnapshots),
            1,
        ),
    };
    $: volatilityVarianceSeries = {
        name: "Volatility-Variance",
        type: "line",
        // color: "#EE6D7A",
        data: applyRatio(
            aggregateAverageVarianceChartData($poolVolatilitySnapshots),
            1,
        ),
    };
    $: volatilityATRSeries = {
        name: "Volatility-Variance",
        type: "line",
        // color: "#EE6D7A",
        data: applyRatio(
            aggregateAverageATRVolatilityChartData($poolVolatilitySnapshots),
            1,
        ),
    };

    $: impermanentLossData = [
        { x: "05/06/2014", y: 100 },
        { x: "05/09/2014", y: 101 },
    ];

    $: impermanentLossSeries = {
        name: "Impermanent Loss",
        type: "line",
        data: impermanentLossData,
    };

    // let slipapgeSeriesFillOptions = {
    //     type: ["gradient", "solid", "solid", "solid"],
    //     // type: 'gradient',
    //     gradient: {
    //         shadeIntensity: 0.5,
    //         type: "vertical",
    //         shade: "dark",
    //         // inverseColors: false,
    //         opacityFrom: [0.55, 1, 1, 0.8],
    //         opacityTo: [0.35, 1, 1, 0.8],
    //         // stops: [0, 100]
    //     },
    // };
    // const y_formatters={Array(5).fill((y) => y.toFixed(0))}
    const y_formatters = [
        (y) => 0.000001 * y.toFixed(0),
        (y) => 0.001 * y.toFixed(0),
        (y) => 0.001 * y.toFixed(0),
        (y) => 0.000001 * y.toFixed(0),
        (y) => y.toFixed(0),
    ];

    $: overviewSeries = [
        tvlDataSeries,
        positiveSlippageSeries,
        negativeSlippageSeries,
        volumeSeries,
        volatilitySeries,
        // volatilityVarianceSeries,
        // volatilityATRSeries,
        // impermanentLossSeries,
    ];

    let overviewFillOptions = {
        type: [
            "gradient",
            "solid",
            "solid",
            "solid",
            "solid",
            "solid",
            "solid",
        ],
        // type: 'gradient',
        gradient: {
            shadeIntensity: 0.5,
            type: "vertical",
            shade: "dark",
            // inverseColors: false,
            opacityFrom: [0.55, 1, 1, 1, 1, 1, 1],
            opacityTo: [0.35, 1, 1, 1, 1, 1, 1],
            // stops: [0, 100]
        },
    };

    onMount(async () => {
    });
</script>

<DataCard>
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn>
            <FactColumnItem
                title="Number of swaps (Last 24 hours)"
                value={last24HoursCount.toLocaleString()}
            />
            <FactColumnItem
                title="TVL (Last 24 hours)"
                value={`$${last24HoursTVL.toLocaleString()}M`}
            />
            <FactColumnItem
                title="Total Volume (Last 24 hours)"
                value={`$${last24HoursVolume?.toLocaleString()}M`}
            />
            <FactColumnItem
                title="Average Volatility (Last 24 hours)"
                value={`${last24HoursVolatility?.toLocaleString()}`}
            />
            <FactColumnItem
                title="Total Positive Slippage (Last 24 hours)"
                value={`$${last24HoursPositiveSlippage?.toLocaleString()}K`}
            />
            <FactColumnItem
                title="Total Negative Slippage (Last 24 hours)"
                value={`$${last24HoursNegativeSlippage?.toLocaleString()}K`}
            />
        </FactColumn>
    </div>
    <div class="w-8" />
    <div class="w-full p-8">
        <div class="flex flex-col">
            {#if overviewSeries != undefined}
                <MultiYaxisTemporalChart
                    dataSeries={overviewSeries}
                    fillOptions={overviewFillOptions}
                    title="Overview"
                    xaxisTitle="Date"
                    yaxisTitles={[
                        "TVL (M$)",
                        "Positive SP (K$)",
                        "Negative SP (K$)",
                        "Volume (M$)",
                        "Volatility",
                    ]}
                    {y_formatters}
                />
            {/if}
            {#if priceImpactSeries[0].data.length > 0}
                <XyChart
                    dataSeries={priceImpactSeries}
                    title="Price Impact"
                    xaxisTitle="Amount In"
                    yaxisTitle="Price Impact (%)"
                    y_formatter={(y) => y.toFixed(2)}
                />
            {/if}
        </div>
    </div>
</DataCard>

<SwapTransactionsTable swapTransactions={$swapTransactions} />
