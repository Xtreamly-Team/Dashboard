<script lang="ts">
    import thickbars from "$lib/data/graphs/thickbars";
    import thinfillbars from "$lib/data/graphs/thinfillbars";
    import ChartWidget from "$lib/widgets/ChartWidget.svelte";
    import { Card, Chart } from "flowbite-svelte";
    import Stats from "$lib/components/dashboard/Stats.svelte";

    import Footer from "$lib/components/Footer.svelte";
    import ActivityList from "$lib/components/dashboard/ActivityList.svelte";
    import Change from "$lib/components/dashboard/Change.svelte";
    import Chat from "$lib/components/dashboard/Chat.svelte";
    import DesktopPc from "$lib/components/dashboard/DesktopPc.svelte";
    import Traffic from "$lib/components/dashboard/Traffic.svelte";
    import Insights from "$lib/components/dashboard/Insights.svelte";
    import Transactions from "$lib/components/dashboard/Transactions.svelte";
    import chart_options_func from "./chart_options";
    import { onMount } from "svelte";
    //    import { PageData } from './$types';
    //
    //
    // export let data: PageData;

    let chartOptions = chart_options_func(false);
    // chartOptions.series = data.series;

    onMount(() => {
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
        <Transactions />
        <!-- <div class="grid gap-2 sm:gap-4 xl:grid-cols-2 2xl:grid-cols-3"> -->

        <!-- <Stats /> -->
        <!-- </div> -->
        <div
            class="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-2 2xl:grid-cols-3"
        >
            <Card horizontal class="items-center justify-between" size="xl">
                <div>
                    <p>New products</p>
                    <p
                        class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                    >
                        2,340
                    </p>
                    <Change value={12.5} since="Since last month" />
                </div>
                <Chart options={thickbars} />
            </Card>
            <Card horizontal class="items-center justify-between" size="xl">
                <div>
                    <p>Users</p>
                    <p
                        class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                    >
                        4,420
                    </p>
                    <Change value={-3.4} since="Since last month" />
                </div>
                <Chart options={thinfillbars} />
            </Card>
            <Card horizontal class="items-center justify-between" size="xl">
                <div>
                    <p>Users</p>
                    <p
                        class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                    >
                        4,420
                    </p>
                    <Change value={-3.4} since="Since last month" />
                </div>
                <Chart
                    options={{
                        ...thinfillbars,
                        plotOptions: {
                            ...thinfillbars.plotOptions,
                            bar: {
                                ...thinfillbars.plotOptions?.bar,
                                horizontal: true,
                            },
                        },
                    }}
                />
            </Card>
        </div>
        <!-- <DesktopPc /> -->
        <!-- <div class="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-2"> -->
        <!-- <Chat /> -->
        <!-- <div class="grid gap-2 sm:gap-4"> -->
        <!-- <Traffic /> -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- <div class="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-2"> -->
        <!-- 	<ActivityList /> -->
        <!-- 	<Insights /> -->
        <!-- </div> -->

        <ChartWidget {chartOptions} title="$345" subtitle="Sales this week" />
    </div>
</main>
<Footer class="mx-2 my-2 sm:mx-4 sm:my-4" />
