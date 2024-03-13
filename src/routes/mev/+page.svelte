<script>
    import { Breadcrumb, BreadcrumbItem, Heading } from "flowbite-svelte";

    import MEV from "./MEV.svelte";
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
                    <BreadcrumbItem href="/mev">MEV</BreadcrumbItem>
                </Breadcrumb>
                <Heading tag="h1" class="mb-4 text-xl sm:text-2xl"
                    >MEV</Heading
                >
            </div>
                <MEV/>
            <!-- <Dashboard /> -->
            <!-- <Overview /> -->
        </div>
    </main>
</div>
