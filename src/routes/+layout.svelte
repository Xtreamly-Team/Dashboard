<script lang="ts">
    import "../app.pcss";
    import Footer from "$lib/components/Footer.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { onMount, setContext } from "svelte";
    import {
        aggregatedSlippagesStore,
        poolVolatilitySnapshotsStore,
        swapTransactionsStore,
        tokenVolumesSnapshotsStore,
        lpRegistryStore,
        slippageCountStore,
    } from "$lib/stores";
    import {
    getBlockForTimestamp,
    getLPInfosForIntervals,
        getPoolsForTokenPair,
        getSlippageAmountForIntervals,
        getSwapTransactions,
        getSwapsCount,
        getVolatilityForIntervals,
        getVolumeForAllTokens,
    } from "$lib/api";
    import {
        getBlockIntervals,
        getCurrentTime,
        getIntervalDates,
        getPreviousDaysStart,
        getSupportedTokens,
        timestampToDate,
    } from "$lib/utils";
    import { TokenPair, AggregatedSlippageAmount, LPSnapshot, type LPRegistry } from "$lib/models";

    let drawerHidden = true;
    setContext("swapTransactions", swapTransactionsStore);
    setContext("slippageCount", slippageCountStore);
    setContext("aggregatedSlippages", aggregatedSlippagesStore);
    setContext("tokenVolumesSnapshots", tokenVolumesSnapshotsStore);
    setContext("poolVolatilitySnapshots", poolVolatilitySnapshotsStore);
    setContext("lpRegistry", lpRegistryStore);

    const [WETH, USDT, USDC, DAI] = getSupportedTokens();
    onMount(async () => {

        let pastWeekIntervals = getPreviousDaysStart(7);
        console.log(pastWeekIntervals)
        // pastWeekIntervals = pastWeekIntervals.slice(0, -1);
        // console.log(pastWeekIntervals)
        const pastWeekBlockIntervals =
            await getBlockIntervals(pastWeekIntervals);
        const pastWeekIntervalDays = getIntervalDates(pastWeekIntervals);

        // const pastMonthIntervals = getPreviousDaysStart(3);
        // const pastMonthblockIntervals =
        //     await getBlockIntervals(pastMonthIntervals);
        // const pastMonthIntervalDays = getIntervalDates(pastMonthIntervals);


        const numberOfSlippages = await getSwapsCount(pastWeekIntervals)
        slippageCountStore.set(numberOfSlippages)

        const currentDayStart = pastWeekIntervals[0];
        const currentTime = getCurrentTime();

        console.log("Start")
        let lps = [... await getPoolsForTokenPair(new TokenPair(WETH, USDT)),
            ... await getPoolsForTokenPair(new TokenPair(WETH, USDC))] 

        const lpRegistryRes: LPRegistry = {};
        for (const lp of lps) {
            const lpSnapshots: LPSnapshot[] = await getLPInfosForIntervals(
                lp,
                // NOTE: Is it true?
                pastWeekIntervals.slice(1, )
            );
            lpRegistryRes[lp.address] = lpSnapshots;
        }

        // console.log(lpRegistryRes);

        lpRegistryStore.set(lpRegistryRes)
        
        const numberOfTransactions = 1000;

        // WORKS
        let transactions = await getSwapTransactions(
            currentDayStart,
            currentTime,
            numberOfTransactions,
        );

        swapTransactionsStore.set(transactions);

        // WORKS
        const aggregatedSlippageAmount =
            await getSlippageAmountForIntervals(pastWeekIntervals);

        aggregatedSlippagesStore.set(aggregatedSlippageAmount);

        // WORKS
        const volumes = await getVolumeForAllTokens(
            pastWeekIntervals,
        );

        tokenVolumesSnapshotsStore.set(volumes);

        // // WORKS
        // // NOTE: Heavy call, takes a while
        const volatilities = await getVolatilityForIntervals(
            pastWeekIntervals,
        );

        poolVolatilitySnapshotsStore.set(volatilities);
        // console.log(volatilities)

        console.log("End")


    });
</script>

<header
    class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
    <Navbar bind:drawerHidden />
</header>
<div class="overflow-hidden lg:flex">
    <Sidebar bind:drawerHidden />
    <div class="relative h-full w-full overflow-y-auto lg:ml-64">
        <slot />
    </div>
</div>
