<script lang="ts">
    import thickbars from "$lib/data/graphs/thickbars";
    import thinfillbars from "$lib/data/graphs/thinfillbars";
    import ChartWidget from "$lib/widgets/ChartWidget.svelte";
    import { Card, Chart } from "flowbite-svelte";

    import Footer from "$lib/components/Footer.svelte";
    import Change from "$lib/components/dashboard/Change.svelte";
    import Transactions from "$lib/components/dashboard/Transactions.svelte";
    import chart_options_func from "./chart_options";
    import { onMount } from "svelte";
    import type {
        AggergatedSlippageAmount,
        SwapTransaction,
    } from "$lib/models/models";
    import {
        getSlippageAmountForIntervals,
        getSwapTransactions,
        getSwapTransactionsForIntervals,
    } from "$lib/api";
    import {
        getPreviousDaysStart,
        getPreviousWeeksStart,
        truncateNumber,
        truncateString,
    } from "$lib/utils";
    import { DataPoint, fatbars } from "$lib/charts";

    let chartOptions = chart_options_func(false);
    // chartOptions.series = data.series;

    let swapTransactions: SwapTransaction[] = [];

    const slippageIntervalDays = 7;
    const slippageIntervalWeeks = 2;

    let slipapgeAmountDayIntervals: AggergatedSlippageAmount[] = [];
    let slippageAmountWeekIntervals: AggergatedSlippageAmount[] = [];

    // $: totalWeekPositiveSlippage = slipapgeAmountDayIntervals.reduce((acc, interval) => acc + Math.abs(interval.positiveSlippage), 0);
    // $: totalWeekNegativeSlippage = slipapgeAmountDayIntervals.reduce((acc, interval) => acc + Math.abs(interval.negativeSlippage), 0);
    $: thisWeekPositiveSlippage =
        slippageAmountWeekIntervals.length > 1
            ? slippageAmountWeekIntervals[1].positiveSlippage
            : 0;
    $: thisWeekNegativeSlippage =
        slippageAmountWeekIntervals.length > 1
            ? slippageAmountWeekIntervals[1].negativeSlippage
            : 0;
    $: totalSlippage = thisWeekPositiveSlippage - thisWeekNegativeSlippage;

    $: previousWeekPositiveSlippage =
        slippageAmountWeekIntervals.length > 0
            ? slippageAmountWeekIntervals[0].positiveSlippage
            : 0;
    $: previousWeekNegativeSlippage =
        slippageAmountWeekIntervals.length > 0
            ? slippageAmountWeekIntervals[0].negativeSlippage
            : 0;
    $: previousWeekTotalSlippage =
        previousWeekPositiveSlippage - previousWeekNegativeSlippage;

    $: positiveSlipapgeChangePercentage =
        previousWeekPositiveSlippage > 0
            ? ((thisWeekPositiveSlippage - previousWeekPositiveSlippage) /
                  previousWeekPositiveSlippage) *
              100
            : 0;

    $: negativeSlipapgeChangePercentage =
        previousWeekNegativeSlippage > 0
            ? ((thisWeekNegativeSlippage - previousWeekNegativeSlippage) /
                  previousWeekNegativeSlippage) *
              100
            : 0;

    $: positiveDataPoints = slipapgeAmountDayIntervals.map((interval, i) => {
        let date = new Date();
        date.setDate(date.getDate() - i);

        return new DataPoint(
            date.toDateString(),
            Number(truncateNumber(interval.positiveSlippage, 2)),
        );
    });

    $: negativeDataPoints = slipapgeAmountDayIntervals.map((interval, i) => {
        let date = new Date();
        date.setDate(date.getDate() - i);

        return new DataPoint(
            date.toDateString(),
            Number(truncateNumber(interval.negativeSlippage, 2)),
        );
    });

    onMount(async () => {
        const dayIntervals = getPreviousDaysStart(slippageIntervalDays);
        console.log(dayIntervals);
        const weekIntervals = getPreviousWeeksStart(slippageIntervalWeeks);
        console.log(weekIntervals);
        const currentDayStart = dayIntervals[0];
        const currentTime = Math.floor(new Date().valueOf() / 1000);
        console.log(currentDayStart, currentTime);

        swapTransactions = await getSwapTransactions(
            currentDayStart,
            currentTime,
            1000,
        );

        // await getSwapTransactionsForIntervals([currentDayStart[0], currentTime]);
        slipapgeAmountDayIntervals =
            await getSlippageAmountForIntervals(dayIntervals);
        slippageAmountWeekIntervals =
            await getSlippageAmountForIntervals(weekIntervals);

        const previousDaysStarts = getPreviousDaysStart(slippageIntervalDays);

        // intervalTransactions = await getSwapTransactionsForIntervals(previousDaysStarts)

        // const observer: MutationObserver = new MutationObserver((mutations) => {
        // 	for (const mutation of mutations) {
        // 		if (mutation.attributeName === 'class') {
        // 			const dark = document.documentElement.classList.contains('dark');
        //
        // 			chartOptions = chart_options_func(dark);
        // 			chartOptions.series = data.series;
        // 		}
        // 	}
        // });
        // observer.observe(document.documentElement, {
        // 	attributes: true,
        // 	childList: false,
        // 	subtree: false
        // });
        //
        // return () => observer.disconnect();
    });
</script>

<main>
    <div class="space-y-2 px-2 pt-2 sm:space-y-4 sm:px-4 sm:pt-4">
        <Transactions {swapTransactions} />
        <div
            class="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-2 
            "
        >
            <Card horizontal class="items-center justify-between" size="xl">
                <div>
                    <p>Positive Slippage</p>
                    <p
                        class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                    >
                        ${truncateNumber(thisWeekPositiveSlippage, 2)}
                    </p>
                    <Change
                        value={Number(
                            truncateNumber(positiveSlipapgeChangePercentage, 2),
                        )}
                        since="Since last week"
                    />
                </div>
                <Chart options={fatbars(positiveDataPoints)} />
            </Card>
            <!-- <Card horizontal class="items-center justify-between" size="xl"> -->
            <!--     <div> -->
            <!--         <p>Average Slippage</p> -->
            <!--         <p -->
            <!--             class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl" -->
            <!--         > -->
            <!--             ${truncateNumber(averagePositiveSlippage, 2)} -->
            <!--         </p> -->
            <!--         <Change value={-3.4} since="Since last month" /> -->
            <!--     </div> -->
            <!--     <Chart options={thinfillbars} /> -->
            <!-- </Card> -->
            <Card horizontal class="items-center justify-between" size="xl">
                <div>
                    <p>Negative Slippage</p>
                    <p
                        class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                    >
                        ${truncateNumber(thisWeekNegativeSlippage, 2)}
                    </p>
                    <Change
                        value={Number(
                            truncateNumber(negativeSlipapgeChangePercentage, 2),
                        )}
                        since="Since last week"
                    />
                </div>
                <Chart options={fatbars(negativeDataPoints)} />
                <!-- <Chart -->
                <!--     options={{ -->
                <!--         ...thinfillbars, -->
                <!--         plotOptions: { -->
                <!--             ...thinfillbars.plotOptions, -->
                <!--             bar: { -->
                <!--                 ...thinfillbars.plotOptions?.bar, -->
                <!--                 horizontal: true, -->
                <!--             }, -->
                <!--         }, -->
                <!--     }} -->
                <!-- /> -->
            </Card>
        </div>
        <!-- <ChartWidget {chartOptions} title="Volume Change" subtitle="Volume change per block" /> -->
    </div>
</main>
<Footer class="mx-2 my-2 sm:mx-4 sm:my-4" />
