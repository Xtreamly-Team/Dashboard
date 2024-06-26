<script lang="ts">
    import {
        lineChart,
        type DataSeries,
        ChartOptionsBuilder,
        pieChart,
    } from "$lib/charts";
    import { Chart } from "flowbite-svelte";
    import { onMount } from "svelte";

    let pieChartBuilder: ChartOptionsBuilder;

    export let title: string = "";
    export let dataSeries: number[];
    export let labels: string[];
    export let legendOptions: ApexLegend | undefined = undefined;

    function createChartBuilder(
        dataSeries: number[],
        labels: string[],
        legendOptions: ApexLegend | undefined,
        dark: boolean,
    ) {
        console.log(dark);
        let mainChartColors;
        if (dark) {
            mainChartColors = {
                backgroundColor: "#000000",
                borderColor: "#374151",
                labelColor: "#9CA3AF",
                opacityFrom: 0,
                opacityTo: 0.15,
                // opacityFrom: 0.55,
                // opacityTo: 0.35,
            };
        } else {
            mainChartColors = {
                backgroundColor: "#FFFFFF",
                borderColor: "#F3F4F6",
                labelColor: "#6B7280",
                opacityFrom: 0.55,
                opacityTo: 0.35,
            };
        }
        let chartBuilder = pieChart(dataSeries, labels, title, dark);
        if (legendOptions) {
            chartBuilder.setLegend(legendOptions);
        } else {
            chartBuilder.setLegend({
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                position: "top",
                floating: false,
                horizontalAlign: "center",
                width: 1000,
                labels: {
                    colors: mainChartColors.labelColor,
                },
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

        return chartBuilder;
    }

    onMount(() => {
        const dark = document.documentElement.classList.contains("dark");

        pieChartBuilder = createChartBuilder(
            dataSeries,
            labels,
            legendOptions,
            dark,
        );

        const observer: MutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "class") {
                    const dark =
                        document.documentElement.classList.contains("dark");

                    pieChartBuilder = createChartBuilder(
                        dataSeries,
                        labels,
                        legendOptions,
                        dark,
                    );
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            childList: false,
            subtree: false,
        });

        return () => observer.disconnect();
    });
</script>

{#if pieChartBuilder}
    <Chart options={pieChartBuilder.build()}></Chart>
{:else}
    <p>Loading...</p>
{/if}
