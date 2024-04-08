<script>
	import {
		DarkMode,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Search,
		ToolbarButton
	} from 'flowbite-svelte';
	import { BellSolid } from 'flowbite-svelte-icons';
	import '../../app.pcss';

	export let fluid = true;
	export let drawerHidden = false;
</script>

<Navbar {fluid} class="mt-px" color="default">
	<NavHamburger
		onClick={() => (drawerHidden = !drawerHidden)}
		class="m-0 me-3 md:block lg:hidden"
	/>
	<NavBrand href="/" class="py-1.5 lg:w-60">
		<img src="/images/xtreamly_logo_white.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Xtreamly</span>
	</NavBrand>
	<div class="ms-auto flex items-center sm:order-2">
		<DarkMode />
	</div>
</Navbar>
