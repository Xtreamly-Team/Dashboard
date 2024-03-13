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
    export let xaxisTitle: string = "";
    export let yaxisTitle: string = "";

    function createChartBuilder(
        dataSeries: DataSeries,
        legendOptions: ApexLegend | undefined,
        xaxisTitle = "",
        yaxisTitle = "",
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
        let chartBuilder = lineChart(dataSeries, dark);
        chartBuilder.setXaxis({
            type: "numeric",
            title: {
                text: xaxisTitle,
                style: {
                    color: mainChartColors.labelColor,
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                },
            },
            labels: {
                trim: true,
                style: {
                    colors: mainChartColors.labelColor,
                    fontSize: "12px",
                    fontWeight: 500,
                },
                // formatter: (value) => {
                //     console.log(value);
                //     return Number(value).toFixed(5);
                // },
            },
            axisBorder: {
                color: mainChartColors.borderColor,
            },
            axisTicks: {
                color: mainChartColors.borderColor,
            },
            crosshairs: {
                show: true,
                position: "back",
                stroke: {
                    color: mainChartColors.borderColor,
                    width: 1,
                    dashArray: 10,
                },
            },
            tooltip: {
                enabled: false,
            },
        });
        chartBuilder.setYaxis({
            labels: {
                style: {
                    colors: mainChartColors.labelColor,
                    fontSize: "12px",
                    fontWeight: 500,
                },
            },
            title: {
                text: yaxisTitle,
                style: {
                    color: mainChartColors.labelColor,
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                },
            },
        });
        chartBuilder.setMarkers({
            size: 6,
            strokeWidth: 0,
            hover: {
                size: 9,
                sizeOffset: 3,
            },
        });
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

        lineChartBuilder = createChartBuilder(
            dataSeries,
            legendOptions,
            xaxisTitle,
            yaxisTitle,
            dark,
        );

        const observer: MutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "class") {
                    const dark =
                        document.documentElement.classList.contains("dark");

                    lineChartBuilder = createChartBuilder(
                        dataSeries,
                        legendOptions,
                        xaxisTitle,
                        yaxisTitle,
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

{#if lineChartBuilder}
    <Chart options={lineChartBuilder.build()}></Chart>
{:else}
    <p>Loading...</p>
{/if}
