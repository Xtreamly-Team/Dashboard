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

    $: numberOfDetectedMEVs = $mevTransactions.arbitrageTransactions.length + $mevTransactions.sandwichTransactions.length;

    $: lastArbitrageBlockNumber =
        $mevTransactions.arbitrageTransactions.length > 0 ? $mevTransactions.arbitrageTransactions[0].blockNumber : 0;

    $: firstArbitrageBlockNumber =
        $mevTransactions.arbitrageTransactions.length > 0 ? $mevTransactions.arbitrageTransactions.at(-1)!.blockNumber : 0;

    $: lastSandwichBlockNumber =
        $mevTransactions.sandwichTransactions.length > 0 ? $mevTransactions.sandwichTransactions[0].blockNumber : 0;

    $: firstSandwichBlockNumber =
        $mevTransactions.sandwichTransactions.length > 0 ? $mevTransactions.sandwichTransactions.at(-1)!.blockNumber : 0;

    $: arbitrageBlockRange = lastArbitrageBlockNumber - firstArbitrageBlockNumber;
    $: sandwichBlockRange = lastSandwichBlockNumber - firstSandwichBlockNumber;

    $: blockRange = Math.max(lastArbitrageBlockNumber, lastSandwichBlockNumber) - Math.min(firstArbitrageBlockNumber, firstSandwichBlockNumber);

    $: averageNumberOfMEVDetectedPerBlock = numberOfDetectedMEVs / blockRange || 1;

    $: averageNumberOfArbitrageDetectedPerBlock = $mevTransactions.arbitrageTransactions.length / arbitrageBlockRange || 1;

    $: averageNumberOfSandwichDetectedPerBlock = $mevTransactions.sandwichTransactions.length / sandwichBlockRange || 1;

    // TODO: This is wrong since it doesn't take into account the different tokens being count as profit
    $: totalProfit = $mevTransactions.arbitrageTransactions.reduce((acc, tx) => acc + tx.profit_amount, 0) + $mevTransactions.sandwichTransactions.reduce((acc, tx) => acc + tx.profit_amount, 0);

    // TODO: This is wrong since it doesn't take into account the different tokens being count as profit
    $: averageProfitPerMEV = totalProfit / numberOfDetectedMEVs;

</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        
        <FactColumn
            title="Number of Detected MEVs (Last 24 Hours)"
            value={numberOfDetectedMEVs.toFixed(0)}
        >
            <FactColumnItem title="Avergae Detected MEVs (Per block)" 
                value={averageNumberOfMEVDetectedPerBlock.toFixed(2)}
            />
            <FactColumnItem title="Avergae Arbitrages (Per block)" 
                value={averageNumberOfArbitrageDetectedPerBlock.toFixed(2)}
            />
            <FactColumnItem title="Avergae Sandwiches (Per block)" 
                value={averageNumberOfSandwichDetectedPerBlock.toFixed(2)}
            />
            <!-- <FactColumnItem -->
            <!--     title="Total Arbitrage Volume (Last 24 Hours):" -->
            <!--     value={(averageProfitPerMEV / 1_000_000 / 1_000_000).toFixed(2)} -->
            <!-- /> -->
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
