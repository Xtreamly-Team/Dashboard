<script lang="ts">
    import {
        MEVArbitrageTransaction,
        MEVArbitrageTransactionTableModel
    } from "$lib/models";
    import { truncateString, truncateNumber } from "$lib/utils";
    import LastRange from "$lib/components/LastRange.svelte";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import DataCard from "../DataCard.svelte";

    export let shownNumber = 10;

    export let arbitrageTransactions: MEVArbitrageTransaction[] = [];
    $: headers = MEVArbitrageTransactionTableModel.headers();
    $: transactions = arbitrageTransactions
        .slice(0, shownNumber - 1)
        .map(MEVArbitrageTransactionTableModel.fromMEVArbitrageTransaction);

    // TODO: Replace with last block number checked from the blockchain. Currently if a blocknumber doesn't have any swap it is not detected.
    $: lastBlockNumber =
        arbitrageTransactions.length > 0 ? arbitrageTransactions[0].blockNumber : 0;
</script>

<DataCard title="Arbitrage Transactions" topTitle={`Last block: ${lastBlockNumber}`}>
    <Table
        hoverable={true}
        noborder
        striped
        class="min-w-full divide-y divide-gray-200 font-normal dark:divide-gray-600"
    >
        <TableHead class="bg-gray-50 dark:bg-gray-700">
            {#each headers as header}
                <TableHeadCell>{header}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each transactions as transaction}
                <TableBodyRow>
                    <TableBodyCell class="font-normal">
                        <a href={`https://etherscan.io/tx/${transaction.hash}`}>
                            {truncateString(transaction.hash, 20, "...", 8, 8)}
                        </a>
                    </TableBodyCell>
                    <TableBodyCell class="font-normal"
                        >{transaction.blockNumber}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(transaction.start_amount, 1)}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(transaction.end_amount, 1)}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(transaction.profit, 1)}</TableBodyCell
                    >
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <div class="flex items-center justify-between pt-3 sm:pt-6">
        <LastRange bind:shownNumber />
    </div>
</DataCard>
