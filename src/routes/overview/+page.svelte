<script>
    import { Breadcrumb, BreadcrumbItem, Heading } from "flowbite-svelte";
    import Overview from "./Overview.svelte";
</script>

<div
    id="main-content"
    class="relative mx-auto h-full w-full max-w-screen-2xl overflow-y-auto bg-gray-50 dark:bg-gray-900"
>
    <main>
        <div class="space-y-2 px-2 pt-2 sm:space-y-4 sm:px-4 sm:pt-4">
            <div class="col-span-full mb-4 xl:mb-2">
                <Heading tag="h1" class="mb-4 text-xl sm:text-2xl"
                    >Overview</Heading
                >
            </div>
            <Overview />
        </div>
    </main>
</div>
