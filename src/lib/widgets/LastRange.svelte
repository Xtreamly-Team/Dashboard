<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline, AngleDownOutline } from 'flowbite-svelte-icons';

    export let shownNumber;

</script>

<div class="font-normal">
	<button class="flex items-center gap-2 p-2">{shownNumber} <ChevronDownOutline size="xs" /></button>
	<Dropdown class="w-48">
		<DropdownItem class="font-normal" on:click={() => {shownNumber = 10}}>10</DropdownItem>
		<DropdownItem class="font-normal" on:click={() => {shownNumber = 50}}>50</DropdownItem>
		<DropdownItem class="font-normal" on:click={() => {shownNumber = 100}}>100</DropdownItem>
		<!-- <div slot="footer" class="py-1" role="none"> -->
		<!-- 	<DropdownItem class="font-normal" href="#">Custom...</DropdownItem> -->
		<!-- </div> -->
	</Dropdown>
</div>
