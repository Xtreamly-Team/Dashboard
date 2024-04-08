<script lang="ts">
    import {
        MEVSandwhichTransaction,
        MEVSandwichTransactionTableModel
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

    export let sandwichTransactions: MEVSandwhichTransaction[] = [];
    $: headers = MEVSandwichTransactionTableModel.headers();
    $: transactions = sandwichTransactions
        .slice(0, shownNumber - 1)
        .map(MEVSandwichTransactionTableModel.fromMEVSandwichTransaction);

    // TODO: Replace with last block number checked from the blockchain. Currently if a blocknumber doesn't have any swap it is not detected.
    $: lastBlockNumber =
        sandwichTransactions.length > 0 ? sandwichTransactions[0].blockNumber : 0;
</script>

<DataCard title="Sandwich Transactions" topTitle={`Last block: ${lastBlockNumber}`}>
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
                        <a href={`https://etherscan.io/tx/${transaction.fronrun_hash}`}>
                            {truncateString(transaction.fronrun_hash, 20, "...", 8, 8)}
                        </a>
                    </TableBodyCell>
                    <TableBodyCell class="font-normal">
                        <a href={`https://etherscan.io/tx/${transaction.backrun_hash}`}>
                            {truncateString(transaction.backrun_hash, 20, "...", 8, 8)}
                        </a>
                    </TableBodyCell>
                    <TableBodyCell class="font-normal"
                        >{transaction.blockNumber}</TableBodyCell
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
