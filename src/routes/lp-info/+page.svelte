<script>
    import { Breadcrumb, BreadcrumbItem, Heading } from "flowbite-svelte";
    import LpInfo from "./LPInfo.svelte";
</script>

<div
    id="main-content"
    class="relative mx-auto h-full w-full max-w-screen-2xl overflow-y-auto bg-gray-50 dark:bg-gray-900"
>
    <main>
        <div class="space-y-2 px-2 pt-2 sm:space-y-4 sm:px-4 sm:pt-4">
            <div class="col-span-full mb-4 xl:mb-2">
                <Breadcrumb class="mb-5">
                    <BreadcrumbItem href="/overview" home>Home</BreadcrumbItem>
                    <BreadcrumbItem href="/lp-info">Liquidity Pools Info</BreadcrumbItem>
                </Breadcrumb>
                <Heading tag="h1" class="mb-4 text-xl sm:text-2xl"
                    >Liquidity Pools Info</Heading
                >
            </div>
            <LpInfo/>
            <!-- <Dashboard /> -->
            <!-- <Overview /> -->
        </div>
    </main>
</div>
