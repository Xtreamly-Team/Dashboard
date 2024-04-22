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
        poolVolumeSnapshotsStore,
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
    setContext("poolVolumeSnapshots", poolVolumeSnapshotsStore);
    setContext("poolImpermanentLossSnapshots", poolImpermanentLossSnapshotsStore);
    setContext("lpRegistry", lpRegistryStore);

    const [WETH, USDT, USDC, DAI] = getSupportedTokens();

    async function loadSlippages(intervals: number[]) {
        const numberOfSlippages = await getSwapsCount(intervals)
        slippageCountStore.set(numberOfSlippages)
    }

    async function loadAggregatedSlippages(intervals: number[]) {
        const aggregatedSlippageAmount =
            await getSlippageAmountForIntervals(intervals);

        aggregatedSlippagesStore.set(aggregatedSlippageAmount);
    }

    async function loadMEV(currentBlock: number, startBlock: number) {
        let mevTransactions = await getMEVTransactions(startBlock,currentBlock, 1000)

        mevTransactionsStore.set(mevTransactions)
    }

    async function loadLPRegistery(pairs: TokenPair[], intervals: number[]) {

        let lps = []

        for (const pair of pairs) {
            lps.push(... await getPoolsForTokenPair(pair))
        }

        const lpRegistryRes: LPRegistry = {};
        for (const lp of lps) {
            const lpSnapshots: LPSnapshot[] = await getLPInfosForIntervals(
                lp,
                // NOTE: Is it true?
                intervals.slice(1, )
                // pastWeekIntervals.slice(1, )
            );
            lpRegistryRes[lp.address] = lpSnapshots;
        }

        lpRegistryStore.set(lpRegistryRes)

    }

    async function loadSwaps(startTime: number, endTime: number, numberOfTransactions: number) {
        const swaps = await getSwapTransactions(
            startTime,
            endTime,
            numberOfTransactions,
        );
        const slippages = await predictSlippageForSwaps(swaps.map((t) => t.id));

        for (const transaction of swaps) {
            const id = transaction.id
            if (Object.keys(slippages).includes(id)) {
                transaction.predictedSlippage = slippages[id]
            }
        }

        swapTransactionsStore.set(swaps);
    }

    async function loadPoolVolumes(intervals: number[]) {
        let poolVolumeSnapshots = await getVolumeForAllPools(
            intervals,
        );

        poolVolumeSnapshotsStore.set(poolVolumeSnapshots);
    }

    async function loadAllTokenVolumes(intervals: number[]) {
        let tokenVolumes = await getVolumeForAllTokens(
            intervals,
        );

        tokenVolumesSnapshotsStore.set(tokenVolumes);
    }

    async function loadImpermanentLoss(intervals: number[]) {
        let impermanentLossData = await getImpermanentLoss(
            intervals,
        );

        poolImpermanentLossSnapshotsStore.set(impermanentLossData);
    }

    // NOTE: Heavy call, takes a while
    async function loadVolatility(intervals: number[]) {
        let volatilities = await getVolatilityForIntervals(
            intervals,
        );

        poolVolatilitySnapshotsStore.set(volatilities);
    }

    onMount(async () => {
        loading = true;
        console.log("Loading Start")

        const numberOfSwapTransactionsToGet = 5000;
        const currentTime = getCurrentTime()
        const past24HoursTime = currentTime - 3600 * 24
        const past7Hours = new Array(7).fill(0).map((_, i) => currentTime - ((6 - i) * 3600))
        const currentBlockForMev = await getBlockForTimestamp(currentTime)
        let pastWeekIntervals = getPreviousDaysStart(7)
        // TODO: Fix after mev transactions are available
        const currentDayStartBlock = await getBlockForTimestamp(pastWeekIntervals.at(-6)!)

        const pastWeekBlockIntervals =
            await getBlockIntervals(pastWeekIntervals)
        const pastWeekIntervalDays = getIntervalDates(pastWeekIntervals)

        const pastMonthIntervals = getPreviousDaysStart(30)

        console.log("Loading Start")

        const slippagePromise = loadSlippages(pastWeekIntervals);

        const mevPromise = loadMEV(currentBlockForMev, currentDayStartBlock)

        const lpRegisteryPromise = loadLPRegistery([new TokenPair(WETH, USDT), new TokenPair(WETH, USDC)], pastWeekIntervals);

        const swapsPromise = loadSwaps(past24HoursTime, currentTime, numberOfSwapTransactionsToGet);

        const poolVolumesPromise = loadPoolVolumes(past7Hours);

        const impermanentLossPromise = loadImpermanentLoss(pastWeekIntervals);

        const aggregatedSlippagesPromise = loadAggregatedSlippages(pastWeekIntervals);

        const allTokenVolumesPromise = loadAllTokenVolumes(pastWeekIntervals);

        const results = await Promise.all([
            slippagePromise,
            mevPromise,
            lpRegisteryPromise,
            swapsPromise,
            poolVolumesPromise,
            impermanentLossPromise,
            aggregatedSlippagesPromise,
            allTokenVolumesPromise,
        ]);

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
