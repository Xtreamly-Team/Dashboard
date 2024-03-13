<script lang="ts">
    import {
        lineChart,
        type DataSeries,
        ChartOptionsBuilder,
    } from "$lib/charts";
    import { Chart } from "flowbite-svelte";
    import { onMount } from "svelte";

    let lineChartBuilder: ChartOptionsBuilder;

    export let dataSeries: DataSeries;
    export let legendOptions: ApexLegend | undefined = undefined;

    onMount(() => {
        lineChartBuilder = lineChart(dataSeries);
        if (legendOptions) {
            lineChartBuilder.setLegend(legendOptions);
        } else {
            lineChartBuilder.setLegend({
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                position: "top",
                floating: false,
                horizontalAlign: "center",
                width: 1000,
                markers: {
                    width: 20,
                    height: 20,
                    radius: 4,
                    strokeWidth: 8,
                    strokeColor: "#000",
                    offsetX: -4,
                },
                itemMargin: {
                    horizontal: 16,
                    vertical: 8,
                },
            });
        }
    });
</script>

{#if lineChartBuilder}
    <Chart options={lineChartBuilder.build()}></Chart>
{:else}
    <p>Loading...</p>
{/if}
