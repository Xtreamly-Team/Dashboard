<script lang="ts">
    import { lineChart, type DataSeries, ChartOptionsBuilder } from "$lib/charts";
    import { Chart } from "flowbite-svelte";
    import { onMount } from "svelte";

    let tvlData = [
        // {x: 'apple', y: 10},
        // {x: 'orange', y: 16}
        { x: "05/06/2014", y: 100 },
        { x: "05/07/2014", y: 101 },
        { x: "05/08/2014", y: 102 },
        { x: "05/09/2014", y: 105 },
        { x: "05/10/2014", y: 99 },
        { x: "05/11/2014", y: 102 },
        { x: "05/12/2014", y: 95 },
    ];

    let tvlSeries = {
        name: "TVL",
        type: "line",
        data: tvlData,
    };

    let positiveSlippageData = [
        // { x: "05/06/2014", y: 30 },
        // { x: "05/08/2014", y: 55 },
        { x: "05/06/2014", y: 110 },
        { x: "05/07/2014", y: 101 },
        { x: "05/08/2014", y: 126 },
        { x: "05/09/2014", y: 91 },
        { x: "05/10/2014", y: 72 },
        { x: "05/11/2014", y: 73 },
        { x: "05/12/2014", y: 109 },
    ];

    let positiveSlippageSeries = {
        name: "Positive Slippage",
        type: "bar",
        data: positiveSlippageData,
    };

    let negativeSlippageData = [
        { x: "05/06/2014", y: 50 },
        { x: "05/07/2014", y: 60 },
        { x: "05/08/2014", y: 40 },
        { x: "05/09/2014", y: 30 },
        { x: "05/10/2014", y: 45 },
        { x: "05/11/2014", y: 70 },
        { x: "05/12/2014", y: 110 },
    ];

    let negativeSlippageSeries = {
        name: "Negative Slippage",
        type: "line",
        data: negativeSlippageData,
    };

    let volumeData = [
        { x: "05/06/2014", y: 1000 },
        { x: "05/10/2014", y: 1010 },
    ];

    let volumeSeries = {
        name: "Volume",
        type: "line",
        data: volumeData,
    };

    let volatilityData = [
        { x: "05/06/2014", y: 33 },
        { x: "05/14/2014", y: 45 },
    ];

    let volatilitySeries = {
        name: "Volatility",
        type: "line",
        color: "#EE6D7A",
        data: volatilityData,
    };

    let impermanentLossData = [
        { x: "05/06/2014", y: 100 },
        { x: "05/09/2014", y: 101 },
    ];

    let impermanentLossSeries = {
        name: "Impermanent Loss",
        type: "line",
        data: impermanentLossData,
    };

    // $: series = [
    //     tvlSeries,
    //     // positiveSlippageSeries,
    //     // negativeSlippageSeries,
    //     // volumeSeries,
    //     // volatilitySeries,
    //     // impermanentLossSeries,
    // ];

    // let series = []

    // let series: DataSeries = [{
    //     data: tvlData,
    // }]

    // TODO: Maybe add annotations

    let lineChartBuilder: ChartOptionsBuilder;
    // $: lineChartOptions = lineChartBuilder ? lineChartBuilder.build() : undefined;
    // lineChartBuilder.setSeries(series);
    onMount(() => {
        let series = [
            tvlSeries,
            positiveSlippageSeries,
            negativeSlippageSeries,
            // volumeSeries,
            // volatilitySeries,
            // impermanentLossSeries,
        ];
        // console.log("series", series);
        lineChartBuilder = lineChart(series);
        // lineChartBuilder.setSeries(series);
        // lineChartBuilder.setStroke({
        //     curve: "smooth",
        //     width: 3,
        //     colors: ["#1A56DB"],
        //     fill: {
        //         type: "solid",
        //     },
        // });
        lineChartBuilder.setLegend({
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            position: "top",
            floating: false,
        });

    });
</script>

{#if lineChartBuilder}
    <Chart options={lineChartBuilder.build()}></Chart>
{:else}
    <p>Loading...</p>
{/if}
