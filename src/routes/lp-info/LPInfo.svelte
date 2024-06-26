<script lang="ts">
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
        ImpermanentLossSnapshot,
    } from "$lib/models";
    import { getSupportedTokens } from "$lib/utils";
    import DataCard from "$lib/components/DataCard.svelte";
    import {
    aggregateAverageATRVolatilityChartData,
    aggregateAverageVarianceChartData,
        aggregateAverageVolatilityChartData,
        aggregateImpermanentLossChartData,
        aggregateVolumeChartData,
        applyRatio,
        calculateAggregateLiquidity,
        calculateAggregateTVL,
        liquidityChartData,
        splitLPRegistry,
        splitPoolImpermanentLossSnapshots,
        splitPoolVolatilitySnapshots,
        splitTokenVolumeSnapshots,
        tvlChartData,
    } from "$lib/process";
    import type { Writable } from "svelte/store";
    import PieChart from "$lib/components/dashboard/PieChart.svelte";

    let swapTransactions =
        getContext<Writable<SwapTransaction[]>>("swapTransactions");
    let slippageCount = getContext<Writable<number[]>>("slippageCount");
    let tokenVolumesSnapshots = getContext<Writable<TokenVolumesSnapshot[]>>(
        "tokenVolumesSnapshots",
    );
    let poolVolatilitySnapshots =
    getContext<Writable<PoolVolatilitiesSnapshot[]>>
    ("poolVolatilitySnapshots");
    let poolImpermanentLossSnapshots = 
    getContext<Writable<ImpermanentLossSnapshot[]>>
    ("poolImpermanentLossSnapshots");
    let lpRegistry = getContext<Writable<LPRegistry>>("lpRegistry");

    $: [usdtTokenVolumes, usdcTokenVolumes, ethTokenVolumes] =
        splitTokenVolumeSnapshots($tokenVolumesSnapshots);

    $: registeries = splitLPRegistry($lpRegistry);
    console.log(registeries);
    // $: usdtLPRegistry = registeries[0]
    // $: usdcLPRegistry = registeries[1]

    $: last24HoursCount = $slippageCount.length
        ? $slippageCount.at(-1) ?? 0
        : 0;

    // console.log(usdtLPRegistry)
    // console.log(usdcLPRegistry)

    $: ETH_USDT_last24HoursTVL = Math.floor(
        [...calculateAggregateTVL(registeries[0])].pop() / 1_000_000,
    );
    $: ETH_USDC_last24HoursTVL = Math.floor(
        [...calculateAggregateTVL(registeries[1])].pop() / 1_000_000,
    );

    $: ETH_USDT_last24HoursLiquidity = Math.floor(
        [...calculateAggregateLiquidity(registeries[0])].pop() / 1_000_000_000 / 1_000_000_000,
    );
    $: ETH_USDC_last24HoursLiquidity = Math.floor(
        [...calculateAggregateLiquidity(registeries[1])].pop() / 1_000_000_000 / 1_000_000_000,
    );

    $: [usdtPoolVolatilitySnapshots, usdcPoolVolatilitySnapshots] =
        splitPoolVolatilitySnapshots($poolVolatilitySnapshots);

    $: ETH_USDT_last24HoursVolatility = [...usdtPoolVolatilitySnapshots].pop()
        ?.averageVolatility;
    $: ETH_USDC_last24HoursVolatility = [...usdcPoolVolatilitySnapshots].pop()
        ?.averageVolatility;
    $: ETH_USDT_last24HoursVolatilityATR = [...usdtPoolVolatilitySnapshots].pop()
        ?.averageATR;
    $: ETH_USDC_last24HoursVolatilityATR = [...usdcPoolVolatilitySnapshots].pop()
        ?.averageATR;
    $: ETH_USDT_last24HoursVolatilityVariance = [...usdtPoolVolatilitySnapshots].pop()
        ?.averageVariance;
    $: ETH_USDC_last24HoursVolatilityVariance = [...usdcPoolVolatilitySnapshots].pop()
        ?.averageVariance;

    $: [usdtImpermanentLossSnapshots, usdcImpermanentLossSnapshots] =
        splitPoolImpermanentLossSnapshots($poolImpermanentLossSnapshots);

    $: usdtImpermanentLossDataSeries = {
        name: "ETH-USDT",
        type: "line",
        data: applyRatio(aggregateImpermanentLossChartData(usdtImpermanentLossSnapshots), 1),
    };

    $: usdcImpermanentLossDataSeries = {
        name: "ETH-USDT",
        type: "line",
        data: applyRatio(aggregateImpermanentLossChartData(usdcImpermanentLossSnapshots), 1),
    };

    $: usdtTvlDataSeries = {
        name: "ETH-USDT",
        type: "line",
        data: applyRatio(tvlChartData(registeries[0]), 0.000001),
    };

    $: usdcTvlDataSeries = {
        name: "ETH-USDC",
        type: "line",
        data: applyRatio(tvlChartData(registeries[1]), 0.000001),
    };

    $: usdtLiquidityDataSeries = {
        name: "ETH-USDT",
        type: "line",
        data: applyRatio(liquidityChartData(registeries[0]), 0.000000001 * 0.000000001),
    };

    $: usdcLiquidityDataSeries = {
        name: "ETH-USDC",
        type: "line",
        data: applyRatio(liquidityChartData(registeries[1]), 0.000000001 * 0.000000001),
    };
    $: usdtVolumeData = aggregateVolumeChartData(usdcTokenVolumes, "total");
    $: usdcVolumeData = aggregateVolumeChartData(usdcTokenVolumes, "total");
    $: ethVolumeData = aggregateVolumeChartData(usdcTokenVolumes, "total");
    
    $: usdtVolumeSeries = {
        name: "USDT",
        type: "line",
        data: applyRatio(usdtVolumeData, 0.001),
    };
    $: usdcVolumeSeries = {
        name: "USDC",
        type: "line",
        data: applyRatio(usdcVolumeData, 0.001),
    };
    $: ethVolumeSeries = {
        name: "ETH",
        type: "line",
        data: applyRatio(ethVolumeData, 0.001),
    };

    $: usdtVolatilitySeries = {
        name: "ETH-USDT",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageVolatilityChartData(usdtPoolVolatilitySnapshots),
    };

    $: usdcVolatilitySeries = {
        name: "ETH-USDC",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageVolatilityChartData(usdcPoolVolatilitySnapshots),
    };


    $: usdtVolatilityATRSeries = {
        name: "ETH-USDT",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageATRVolatilityChartData(usdtPoolVolatilitySnapshots),
    };

    $: usdcVolatilityATRSeries = {
        name: "ETH-USDC",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageATRVolatilityChartData(usdcPoolVolatilitySnapshots),
    };

    $: usdtVolatilityVarianceSeries = {
        name: "ETH-USDT",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageVarianceChartData(usdtPoolVolatilitySnapshots),
    };

    $: usdcVolatilityVarianceSeries = {
        name: "ETH-USDC",
        type: "line",
        // color: "#EE6D7A",
        data: aggregateAverageVarianceChartData(usdcPoolVolatilitySnapshots),
    };

    $: tvlSeries = [usdtTvlDataSeries, usdcTvlDataSeries];
    $: liquiditySeries = [usdtLiquidityDataSeries, usdcLiquidityDataSeries];
    $: volumeSeries = [usdtVolumeSeries, usdcVolumeSeries, ethVolumeSeries];
    $: impermanentLossSeries = [usdtImpermanentLossDataSeries, usdcImpermanentLossDataSeries];
    $: volatilitySeries = [usdtVolatilitySeries, usdcVolatilitySeries];
    $: volatilityATRSeries = [usdtVolatilityATRSeries, usdcVolatilityATRSeries];
    $: volatilityVarianceSeries = [usdtVolatilityVarianceSeries, usdcVolatilityVarianceSeries];

    // $: overviewSeries = [
    //     tvlDataSeries,
    //     volumeSeries,
    //     volatilitySeries,
    //     // impermanentLossSeries,
    // ];

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
                title="ETH_USDT TVL (Last 24 hours)"
                value={`$${ETH_USDT_last24HoursTVL.toFixed(0)}M`}
            />
            <FactColumnItem
                title="ETH_USDC TVL (Last 24 hours)"
                value={`$${ETH_USDC_last24HoursTVL.toFixed(0)}M`}
            />
            <FactColumnItem
                title="ETH_USDT Liquidity (Last 24 hours)"
                value={`${ETH_USDT_last24HoursLiquidity.toFixed(0)} ETH`}
            />
            <FactColumnItem
                title="ETH_USDC Liquidity (Last 24 hours)"
                value={`${ETH_USDC_last24HoursLiquidity.toFixed(0)} ETH`}
            />
            <FactColumnItem
                title="ETH_USDT Volatility Std (Last 24 hours)"
                value={`${ETH_USDT_last24HoursVolatility?.toFixed(2)}`}
            />
            <FactColumnItem
                title="ETH_USDC Volatility Std (Last 24 hours)"
                value={`${ETH_USDC_last24HoursVolatility?.toFixed(2)}`}
            />
            <FactColumnItem
                title="ETH_USDT Volatility ATR (Last 24 hours)"
                value={`${ETH_USDT_last24HoursVolatilityATR?.toFixed(2)}`}
            />
            <FactColumnItem
                title="ETH_USDC Volatility ATR (Last 24 hours)"
                value={`${ETH_USDC_last24HoursVolatilityATR?.toFixed(2)}`}
            />
            <FactColumnItem
                title="ETH_USDT Volatility Variance (Last 24 hours)"
                value={`${ETH_USDT_last24HoursVolatilityVariance?.toFixed(2)}`}
            />
            <FactColumnItem
                title="ETH_USDC Volatility Variance (Last 24 hours)"
                value={`${ETH_USDC_last24HoursVolatilityVariance?.toFixed(2)}`}
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                {#if tvlSeries != undefined}
                    <TemporalChart 
                        title="TVL"
                        yaxisTitle="TVL (M$)"
                        xaxisTitle="Date"
                        dataSeries={tvlSeries}

                    />
                {/if}
                {#if liquiditySeries != undefined}
                    <TemporalChart 
                        title="Liquidty"
                        yaxisTitle="Liquidity (ETH)"
                        xaxisTitle="Date"
                        dataSeries={liquiditySeries} />
                {/if}
                {#if impermanentLossSeries != undefined}
                    <TemporalChart 
                        title="Impermanent Loss"
                        yaxisTitle="Impermanent Loss (USD)"
                        xaxisTitle="Date"
                        dataSeries={impermanentLossSeries} />
                {/if}
                {#if volatilitySeries != undefined}
                    <TemporalChart 
                        title="Volatility STD"
                        yaxisTitle="Volatility Standard Deviation"
                        xaxisTitle="Date"
                        dataSeries={volatilitySeries} />
                {/if}
                {#if volatilityATRSeries != undefined}
                    <TemporalChart 
                        title="Volatility ATR"
                        yaxisTitle="Volatility ATR"
                        xaxisTitle="Date"
                        dataSeries={volatilityATRSeries} />
                {/if}
                {#if volatilityVarianceSeries != undefined}
                    <TemporalChart 
                        title="Volatility Variance"
                        yaxisTitle="Volatility Variance"
                        xaxisTitle="Date"
                        dataSeries={volatilityVarianceSeries} />
                {/if}
            </div>
        </div>
    </div>
</DataCard>
