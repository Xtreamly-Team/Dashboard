<script lang="ts">
    import type {
        AggergatedSlippageAmount,
        SwapTransaction,
    } from "$lib/models/models";
    import {
        getSwapTransactions,
    } from "$lib/api";
    import {
        getPreviousDaysStart,
        getPreviousWeeksStart,
        truncateNumber,
        truncateString,
    } from "$lib/utils";
    import { onMount } from "svelte";
    import TransactionsTable from "$lib/components/dashboard/TransactionsTable.svelte";


    let swapTransactions: SwapTransaction[] = [];

    const slippageIntervalDays = 7;
    const slippageIntervalWeeks = 2;

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

    });

</script>
<TransactionsTable {swapTransactions} />
