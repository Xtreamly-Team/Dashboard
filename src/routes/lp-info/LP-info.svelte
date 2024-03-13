<script lang="ts">
    import DataCard from "$lib/components/DataCard.svelte";

    // TODO: Add gas fee to table
    import FactColumn from "$lib/components/dashboard/FactColumn.svelte";
    import FactColumnItem from "$lib/components/dashboard/FactColumnItem.svelte";
    import TemporalChart from "$lib/components/dashboard/TemporalChart.svelte";
    import XyChart from "$lib/components/dashboard/XYChart.svelte";

    let tvlData = [
        // {x: 'apple', y: 10},
        // {x: 'orange', y: 16}
        { x: "05/06/2014", y: 100 },
        { x: "05/07/2014", y: 101 },
        { x: "05/08/2014", y: 102 },
        { x: "05/09/2014", y: 105 },
        { x: "05/10/2014", y: 99 },
        { x: "05/11/2014", y: 102 },
        { x: "05/12/2014", y: 95 },
    ];

    let tvlSeries = {
        name: "TVL",
        type: "line",
        data: tvlData,
    };

    let volumeData = [
        { x: "05/06/2014", y: 200 },
        { x: "05/10/2014", y: 150 },
    ];

    let volumeSeries = {
        name: "Volume",
        type: "area",
        data: volumeData,
    };

    // TODO: Maybe add annotations
    let lpInfoSeries = [
        tvlSeries,
        volumeSeries,
    ];

</script>

<DataCard title='Aggregate Data'>
    <div class="w-full flex flex-wrap lg:flex-nowrap">
    <FactColumn title="Total value locked (Weekly Average)" value="$135.395b">
        <FactColumnItem title="Number of Swaps" value="54412" />
        <FactColumnItem title="Total Volume (Last 24 Hours):" value="$144.618b" />
        <FactColumnItem title="Total Value Locked (Yesterday)" value="$144.618b" />
    </FactColumn>
        <div class="w-8" />
        <div class="w-full p-8">
            <div class="flex flex-col">
            <TemporalChart dataSeries={lpInfoSeries} />
        </div>
    </div>
</DataCard>
