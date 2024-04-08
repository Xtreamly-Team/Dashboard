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
        data: applyRatio(tvlChartData($lpRegistry), 0.001),
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
        data: applyRatio(volumeData, 0.001),
    };

    // $: volatilityData = [
    //     { x: "05/06/2014", y: 33 },
    //     { x: "05/14/2014", y: 45 },
    // ];

    $: volatilitySeries = {
        name: "Volatility-Std",
        type: "line",
        // color: "#EE6D7A",
        data: applyRatio(
            aggregateAverageVolatilityChartData($poolVolatilitySnapshots),
            100,
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
            100,
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

    $: overviewSeries = [
        tvlDataSeries,
        positiveSlippageSeries,
        negativeSlippageSeries,
        volumeSeries,
        volatilitySeries,
        volatilityVarianceSeries,
        volatilityATRSeries,
        // impermanentLossSeries,
    ];

    // // TODO: Maybe add annotations
    // let overviewSeries: ApexAxisChartSeries | undefined = undefined;

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

    onMount(async () => {
        const [WETH, USDT, USDC, DAI] = getSupportedTokens();
    });
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn
            title="Number of swaps (Last 24 hours)"
            value={last24HoursCount.toFixed(0)}
        >
            <FactColumnItem
                title="TVL (Last 24 hours)"
                value={`$${last24HoursTVL.toFixed(0)}M`}
            />
            <FactColumnItem
                title="Total Volume (Last 24 hours)"
                value={`$${last24HoursVolume?.toFixed(0)}M`}
            />
            <FactColumnItem
                title="Average Volatility (Last 24 hours)"
                value={`${last24HoursVolatility?.toFixed(2)}%`}
            />
            <FactColumnItem
                title="Total Positive Slippage (Last 24 hours)"
                value={`$${last24HoursPositiveSlippage?.toFixed(0)}K`}
            />
            <FactColumnItem
                title="Total Negative Slippage (Last 24 hours)"
                value={`$${last24HoursNegativeSlippage?.toFixed(0)}K`}
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if overviewSeries != undefined}
                    <TemporalChart
                        dataSeries={overviewSeries}
                        fillOptions={overviewFillOptions}
                        title="Overview"
                        yaxisTitle="Amount (Relative)"
                        xaxisTitle="Date"
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
    </div>
</DataCard>


<SwapTransactionsTable swapTransactions={$swapTransactions} />
