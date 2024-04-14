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
        mevTransactionsStore,
        poolImpermanentLossSnapshotsStore,
    } from "$lib/stores";
    import {
    getBlockForTimestamp,
    getImpermanentLoss,
    getLPInfosForIntervals,
        getMEVTransactions,
        getPoolsForTokenPair,
        getSlippageAmountForIntervals,
        getSwapTransactions,
        getSwapsCount,
        getVolatilityForIntervals,
        getVolumeForAllPools,
        getVolumeForAllTokens,
        predictSlippageForSwaps,
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
    import Loading from "$lib/pages/Loading.svelte";

    let loading = true;

    let drawerHidden = true;
    setContext("swapTransactions", swapTransactionsStore);
    setContext("mevTransactions", mevTransactionsStore);
    setContext("slippageCount", slippageCountStore);
    setContext("aggregatedSlippages", aggregatedSlippagesStore);
    setContext("tokenVolumesSnapshots", tokenVolumesSnapshotsStore);
    setContext("poolVolatilitySnapshots", poolVolatilitySnapshotsStore);
    setContext("poolImpermanentLossSnapshots", poolImpermanentLossSnapshotsStore);
    setContext("lpRegistry", lpRegistryStore);

    const [WETH, USDT, USDC, DAI] = getSupportedTokens();
    onMount(async () => {

        let pastWeekIntervals = getPreviousDaysStart(7);
        // pastWeekIntervals = pastWeekIntervals.slice(0, -1);
        // console.log(pastWeekIntervals)
        const pastWeekBlockIntervals =
            await getBlockIntervals(pastWeekIntervals);
        const pastWeekIntervalDays = getIntervalDates(pastWeekIntervals);

        const pastMonthIntervals = getPreviousDaysStart(30);
        // const pastMonthblockIntervals =
        //     await getBlockIntervals(pastMonthIntervals);
        // const pastMonthIntervalDays = getIntervalDates(pastMonthIntervals);


        const numberOfSlippages = await getSwapsCount(pastWeekIntervals)
        slippageCountStore.set(numberOfSlippages)

        // TODO: Fix to -1 after we have enough data
        const currentDayStart = pastWeekIntervals.at(-1)!;
        const currentTime = getCurrentTime();

        console.log("Loading Start")
        // console.log(pastWeekIntervals)

        const currentBlockForMev = await getBlockForTimestamp(currentTime)

        // TODO: Fix after mev transactions are available
        const currentDayStartBlock = await getBlockForTimestamp(pastWeekIntervals.at(-6)!)

        // console.log(currentBlockForMev, currentDayStartBlock)

        let mevTransactions = await getMEVTransactions(currentDayStartBlock,currentBlockForMev, 1000)

        // console.log(mevTransactions)

        mevTransactionsStore.set(mevTransactions)

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

        let poolVolumeSnapshots = await getVolumeForAllPools(
            pastWeekIntervals,
        );

        console.log(poolVolumeSnapshots)


        // // We're only considering transactions that deal with universal router directly
        // const universalTransactions = transactions.filter(
        //     (transaction) => transaction.thresholdPercentage,
        // );

        // console.log(universalTransactions.length)

        const slippages = await predictSlippageForSwaps(transactions.map((t) => t.id));

        // console.log(slippages)
        //
        for (const transaction of transactions) {
            const id = transaction.id
            if (Object.keys(slippages).includes(id)) {
                transaction.predictedSlippage = slippages[id]
            }
        }
        swapTransactionsStore.set(transactions);


        let impermanentLossData = await getImpermanentLoss(
            pastWeekIntervals,
        );

        poolImpermanentLossSnapshotsStore.set(impermanentLossData);

        // // WORKS
        const aggregatedSlippageAmount =
            await getSlippageAmountForIntervals(pastWeekIntervals);

        aggregatedSlippagesStore.set(aggregatedSlippageAmount);
        //
        // // WORKS
        const volumes = await getVolumeForAllTokens(
            pastWeekIntervals,
        );


        tokenVolumesSnapshotsStore.set(volumes);
        //
        // // // WORKS
        // // // NOTE: Heavy call, takes a while
        const volatilities = await getVolatilityForIntervals(
            pastWeekIntervals,
        );
        //
        poolVolatilitySnapshotsStore.set(volatilities);
        // // console.log(volatilities)
        //
        console.log("Loading End")
        loading = false;
        return


    });
</script>

<header
    class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
    <Navbar bind:drawerHidden />
</header>
{#if loading}
    <Loading/>
{:else}
<div class="overflow-hidden lg:flex">
    <Sidebar bind:drawerHidden />
    <div class="relative h-full w-full overflow-y-auto lg:ml-64">
        <slot />
    </div>
</div>
{/if}
