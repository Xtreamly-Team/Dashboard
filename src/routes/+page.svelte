<script>
	import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from 'flowbite-svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Dashboard from './Dashboard.svelte';
</script>

<svelte:head>
	<title>Slippage Dashboard</title>
</svelte:head>

<Navbar fluid={false} />
<div
	id="main-content"
	class="relative mx-auto h-full w-full max-w-screen-2xl overflow-y-auto bg-gray-50 dark:bg-gray-900"
>
	<Dashboard />
</div>
