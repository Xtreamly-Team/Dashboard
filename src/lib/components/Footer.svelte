<script lang="ts">
	import { Card, type LinkType } from 'flowbite-svelte';
	import {
		// DiscordSolid,
		DribbbleSolid,
		FacebookSolid,
		GithubSolid,
		TwitterSolid,
        MailBoxSolid
	} from 'flowbite-svelte-icons';
	import type { ComponentType } from 'svelte';

	const links: LinkType[] = [
		{ name: 'Docs', href: 'https://info.xtreamly.io' },
		{ name: 'Metamask-Snap', href: 'https://snap.xtreamly.io' },
		// { name: 'Privacy Policy', href: '#' },
		// { name: 'Licensing', href: '#' },
		// { name: 'Cookie Policy', href: '#' },
		// { name: 'Contact', href: '#' }
	];

	const brands: [ComponentType, string][] = [
		// [FacebookSolid, ''],
		[MailBoxSolid, 'mailto:info@xtreamly.io'],
		[GithubSolid, 'https://github.com/Xtreamly-Team'],
		// [DribbbleSolid, ''],
		// [DiscordSolid, '']
	];
</script>

<Card
	tag="footer"
	size="none"
	horizontal
	class="w-auto gap-2 sm:gap-4 md:max-w-none md:items-center md:justify-between {$$props.class ??
		''} shadow-none"
>
	<ul class="flex flex-wrap items-center gap-2 sm:gap-4 md:mb-0">
		{#each links as { name, href }}
			<li>
				<a {href} class="text-sm font-normal text-gray-500 hover:underline dark:text-gray-400">
					{name}
				</a>
			</li>
		{/each}
	</ul>
	<div class="flex space-x-6 sm:justify-center">
		{#each brands as [component, href]}
			<a {href} class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
				<svelte:component this={component} size="sm" />
			</a>
		{/each}
	</div>
</Card>
