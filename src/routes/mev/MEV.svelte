<script lang="ts">
    import DataCard from "$lib/components/DataCard.svelte";
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import MevArbitrageTransactionsTable from "$lib/components/dashboard/MEVArbitrageTransactionsTable.svelte";
    import MevSandwichTransactionsTable from "$lib/components/dashboard/MEVSandwichTransactionsTable.svelte";
    import type { MEVTransactions } from "$lib/models";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    let mevTransactions = getContext<Writable<MEVTransactions>>("mevTransactions");

    // TODO: This is wrong since it doesn't take into account the different tokens being count as profit
    $: totalProfit = $mevTransactions.arbitrageTransactions.reduce((acc, tx) => acc + tx.profit_amount, 0) + $mevTransactions.sandwichTransactions.reduce((acc, tx) => acc + tx.profit_amount, 0);

    $: numberOfDetectedMEVs = $mevTransactions.arbitrageTransactions.length + $mevTransactions.sandwichTransactions.length;

    // TODO: This is wrong since it doesn't take into account the different tokens being count as profit
    $: averageProfitPerMEV = totalProfit / numberOfDetectedMEVs;

</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        
        <FactColumn
            title="Total Profit (Last 24 Hours)"
            value={(totalProfit / 1_000_000 / 1_000_000).toFixed(2)}
        >
            <FactColumnItem title="Number of Detected MEVs (Last 24 Hours)" value={numberOfDetectedMEVs.toFixed(0)}/>
            <FactColumnItem
                title="Total Arbitrage Volume (Last 24 Hours):"
                value={(averageProfitPerMEV / 1_000_000 / 1_000_000).toFixed(2)}
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                <!-- <TemporalChart dataSeries={lpInfoSeries} /> -->
            </div>
        </div>
    </div></DataCard
>

<MevArbitrageTransactionsTable arbitrageTransactions={$mevTransactions.arbitrageTransactions}/>
<MevSandwichTransactionsTable sandwichTransactions={$mevTransactions.sandwichTransactions}/>
