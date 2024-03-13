<script lang="ts">
    export let title: string;
    export let value: string;
</script>


<div class="flex flex-col lg:min-w-96 w-96 m-4">
    <div class="font-thin text-lg">{title}</div>
    <div class="font-bold text-lg">{value}</div>
    <div class="flex flex-col gap-2 py-6">
        <slot/>
    </div>
</div>
