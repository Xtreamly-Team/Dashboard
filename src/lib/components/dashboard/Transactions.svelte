<script lang="ts">
    import { SwapTransaction, SwapTransactionTableModel } from '$lib/models/models';
    import { truncateString, truncateNumber } from '$lib/utils';
	import LastRange from '$lib/widgets/LastRange.svelte';
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
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		CalendarMonthOutline,
		ChevronDownOutline,
		ChevronRightOutline
	} from 'flowbite-svelte-icons';
	import StatusBadge from './StatusBadge.svelte';
	import CreditCard from './CreditCard.svelte';

    export let shownNumber = 10;

    export let swapTransactions: SwapTransaction[] = [];
    $: headers = SwapTransactionTableModel.headers();
    $: transactions = swapTransactions.slice(0, shownNumber - 1).map(SwapTransactionTableModel.fromSwapTransaction);

    // TODO: Replace with last block number checked from the blockchain. Currently if a blocknumber doesn't have any swap it is not detected.
    $: lastBlockNumber = swapTransactions.length > 0 ? swapTransactions[0].blockNumber : 0;

</script>

<Card size="xl" class="h-fit max-w-none">
	<div
		class="items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700 sm:flex"
	>
		<div class="mb-4 w-full sm:mb-0">
			<h3 class="text-base font-normal text-gray-500 dark:text-gray-400">{`Last block: ${lastBlockNumber}`}</h3>
			<span class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
				>Swap Transactions</span
			>
		</div>
		<div class="w-full max-w-lg">
			<div class="grid grid-cols-3 items-center gap-4">
				<!-- <Button color="alternative" class="whitespace-nowrap"> -->
				<!-- 	Filter by <span class="hidden sm:inline">status</span> -->
				<!-- 	<ChevronDownOutline size="xs" class="ms-2" /> -->
				<!-- </Button> -->
				<!-- <Dropdown class="w-44 space-y-3 p-3 text-sm" placement="bottom-start"> -->
				<!-- 	<li><Checkbox class="accent-primary-600">Completed (56)</Checkbox></li> -->
				<!-- 	<li><Checkbox checked>Cancelled (56)</Checkbox></li> -->
				<!-- 	<li><Checkbox class="accent-primary-600">In progress (56)</Checkbox></li> -->
				<!-- 	<li><Checkbox checked>In review (97)</Checkbox></li> -->
				<!-- </Dropdown> -->
				<!-- <Input placeholder="From"> -->
				<!-- 	<CalendarMonthOutline slot="left" size="sm" /> -->
				<!-- </Input> -->
				<!-- <Input placeholder="To"> -->
				<!-- 	<CalendarMonthOutline slot="left" size="sm" /> -->
				<!-- </Input> -->
			</div>
		</div>
	</div>
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
					<TableBodyCell class="font-normal">{truncateString(transaction.hash, 20, '...',8, 8)}</TableBodyCell>
					<TableBodyCell class="font-normal">{transaction.blockNumber}</TableBodyCell>
					<TableBodyCell class="font-normal">{transaction.tokenInSymbol}</TableBodyCell>
					<TableBodyCell class="font-normal">{transaction.tokenOutSymbol}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.amountIn)}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.quotedPrice)}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.executedPrice)}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.slippage)}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.slippagePercentage)}</TableBodyCell>
					<TableBodyCell class="font-normal">{truncateNumber(transaction.priceImpact)}</TableBodyCell>
					<!-- <TableBodyCell>{amount}</TableBodyCell> -->
					<!-- <TableBodyCell class="font-normal">{reference}</TableBodyCell> -->
					<!-- <TableBodyCell class="flex items-center gap-2 font-normal"> -->
					<!-- 	<CreditCard number={method} /> <span>••• {method}</span> -->
					<!-- </TableBodyCell> -->
					<!-- <TableBodyCell class="font-normal"><StatusBadge state={status} /></TableBodyCell> -->
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<div class="flex items-center justify-between pt-3 sm:pt-6">
		<LastRange bind:shownNumber={shownNumber}/>
		<!-- <a -->
		<!-- 	href="#top" -->
		<!-- 	class="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm" -->
		<!-- > -->
		<!-- 	Transactions report <ChevronRightOutline size="sm" class="ms-2" /> -->
		<!-- </a> -->
	</div>
</Card>
