<script lang="ts">
    import DataCard from "$lib/components/DataCard.svelte";
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
</script>

<DataCard title="Aggregate Data">
    <div class="w-full flex flex-wrap lg:flex-nowrap">
        <FactColumn
            title="Total Value Lossed (Yesterday)"
            value="$135.395b"
        >
            <FactColumnItem title="Number of Detected MEVs" value="54412" />
            <FactColumnItem
                title="Total Arbitrage Volume (Last 24 Hours):"
                value="$144.618b"
            />
        </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
                <!-- <TemporalChart dataSeries={lpInfoSeries} /> -->
            </div>
        </div>
    </div></DataCard
>
