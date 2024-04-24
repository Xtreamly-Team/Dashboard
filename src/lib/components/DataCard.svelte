<script lang="ts">
    import { Card } from "flowbite-svelte";
    export let title: string = "";
    export let topTitle: string | undefined = undefined;
</script>

<Card size="xl" class="h-fit max-w-none ">
    {#if title}
        <div class="mb-8 w-full sm:mb-4">
            {#if topTitle}
                <h3
                    class="text-base font-normal text-gray-500 dark:text-gray-400"
                >
                    {topTitle}
                </h3>
            {/if}
            <span
                class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
                >{title}</span
            >
        </div>
    {/if}
    <slot />
</Card>
