<script lang="ts">
    import {
        SwapTransaction,
        SwapTransactionTableModel,
    } from "$lib/models";
    import { truncateString, truncateNumber } from "$lib/utils";
    import LastRange from "$lib/components/LastRange.svelte";
    import {
        Button,
        Card,
        Checkbox,
        Dropdown,
        Input,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import DataCard from "../DataCard.svelte";

    export let shownNumber = 10;

    export let swapTransactions: SwapTransaction[] = [];
    $: thresholdTransactionsRaw = swapTransactions.filter(
        (transaction) => transaction.thresholdPercentage
    );
    $: headers = SwapTransactionTableModel.headers();
    $: transactions = swapTransactions
        .slice(0, shownNumber - 1)
        .map(SwapTransactionTableModel.fromSwapTransaction);
    $: thresholdTransactions = thresholdTransactionsRaw
        .slice(0, shownNumber - 1)
        .map(SwapTransactionTableModel.fromSwapTransaction);

    // TODO: Replace with last block number checked from the blockchain. Currently if a blocknumber doesn't have any swap it is not detected.
    $: lastBlockNumber =
        swapTransactions.length > 0 ? swapTransactions[0].blockNumber : 0;
</script>

<DataCard title="Transactions" topTitle={`Last block: ${lastBlockNumber}`}>
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
            {#each thresholdTransactions as transaction}
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
                        >{`${truncateNumber(transaction.amountIn, 4)} ${
                            transaction.tokenInSymbol
                        }`}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{`${truncateNumber(transaction.amountOut, 4)} ${
                            transaction.tokenOutSymbol
                        }`}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(
                            transaction.quotedPrice,
                        )}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(
                            transaction.executedPrice,
                        )}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(transaction.gasFee, 0)}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(transaction.slippage)}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(
                            transaction.slippagePercentage,
                        )}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(
                            transaction.thresholdPercentage,
                        )}</TableBodyCell
                    >
                    <TableBodyCell class="font-normal"
                        >{truncateNumber(
                            transaction.priceImpact,
                        )}</TableBodyCell
                    >
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <div class="flex items-center justify-between pt-3 sm:pt-6">
        <LastRange bind:shownNumber />
    </div>
</DataCard>
