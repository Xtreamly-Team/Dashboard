<script lang="ts">
    export let title: string = "";
    export let value: string = "";
</script>

<div class="flex flex-col lg:min-w-96 w-[36rem]">
    {#if title && value}
        <div class="font-thin text-lg">{title}</div>
        <div class="font-bold text-lg">{value}</div>
    {/if}
    <div class="flex flex-col gap-2 py-6">
        <slot />
    </div>
</div>
