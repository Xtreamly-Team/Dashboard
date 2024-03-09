<script>
	import { FooterCopyright, FooterLink, FooterLinkGroup } from 'flowbite-svelte';
    import Footer from "$lib/components/Footer.svelte";
	import Navbar from '$lib/components/Navbar.svelte';
	import Dashboard from './Dashboard.svelte';
    import Overview from './Overview.svelte';
</script>

<svelte:head>
	<title>Slippage Dashboard</title>
</svelte:head>

<Navbar fluid={false} />
<div
	id="main-content"
	class="relative mx-auto h-full w-full max-w-screen-2xl overflow-y-auto bg-gray-50 dark:bg-gray-900"
>
<main>
    <div class="space-y-2 px-2 pt-2 sm:space-y-4 sm:px-4 sm:pt-4">
	<!-- <Dashboard /> -->
	<Overview/>
    </div>
</main>
<Footer class="mx-2 my-2 sm:mx-4 sm:my-4" />
</div>
