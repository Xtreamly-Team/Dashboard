<script lang="ts">
    import {
        lineChart,
        type DataSeries,
        ChartOptionsBuilder,
    } from "$lib/charts";
    import { Chart } from "flowbite-svelte";
    import { onMount } from "svelte";


    export let dataSeries: DataSeries;
    export let legendOptions: ApexLegend | undefined = undefined;
    export let fillOptions: ApexFill | undefined = undefined;
    export let title: string = '';
    export let xaxisTitle: string = "";
    export let yaxisTitle: string = "";
    export let y_formatter = (value: number) => Math.floor(value).toFixed(0);

    function createChartBuilder(dataSeries: DataSeries, 
        legendOptions: ApexLegend | undefined,
        fillOptions: ApexFill | undefined,
        dark: boolean) {
        let mainChartColors;
        if (dark) {
            mainChartColors = {
                backgroundColor: "#000000",
                borderColor: "#374151",
                labelColor: "#9CA3AF",
                opacityFrom: 0,
                opacityTo: 0.15,
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
        let chartBuilder = lineChart(dataSeries, 
            title,
            xaxisTitle,
            yaxisTitle,
            dark,
            y_formatter,
        );
        if (fillOptions) {
            chartBuilder.setFill(fillOptions);
        }
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

        return chartBuilder
    }

    $: lineChartBuilder = createChartBuilder(dataSeries, legendOptions, fillOptions, true)

    onMount(() => {
        const dark = document.documentElement.classList.contains('dark');

        lineChartBuilder = createChartBuilder(dataSeries, legendOptions, fillOptions, dark);

		const observer: MutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'class') {
					const dark = document.documentElement.classList.contains('dark');

                    lineChartBuilder = createChartBuilder(dataSeries, legendOptions, fillOptions, dark);
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			childList: false,
			subtree: false
		});

		return () => observer.disconnect();
    });
</script>

{#if lineChartBuilder}
    <Chart options={lineChartBuilder.build()}></Chart>
{:else}
    <p>Loading...</p>
{/if}
