<template>
    <AdminLayout>
        <div class="mb-6 flex flex-col md:flex-row gap-6 justify-between md:items-center">
            <h1 class="text-2xl font-bold text-gray-900">Розіграші</h1>
            <Button @click="handleOpenCreateGiveaway">
                <Gift class="w-5 h-5 text-white" />
                Створити розіграш
            </Button>
        </div>
        <div class="w-full overflow-x-auto scrollbar-hide mb-6">
    <nav class="flex w-max border-b border-gray-200">
        <button
            v-for="tab in tabStore.tabs"
            :key="tab.id"
            @click="tabStore.setActiveTab(tab.id)"
            :class="[
                'px-4 py-2 font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                    ? 'border-b-2 border-[#6734ff] text-[#6734ff]'
                    : 'text-gray-500 hover:text-gray-700 hover:border-[#6734ff]'
            ]">
            {{ tab.label }} ({{ giveawaysByStatus[tab.id] || 0 }})
        </button>
    </nav>
</div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <GiveawayCard
                v-for="giveaway in filteredGiveaways"
                :key="giveaway.id"
                :giveaway="giveaway"
                v-if="filteredGiveaways?.length > 0" />

            <div
                v-else-if="filteredGiveaways?.length === 0 && isLoading"
                class="col-span-full flex items-center justify-center mt-12">
                <Loader size="xl" />
            </div>

            <div
                v-else-if="filteredGiveaways?.length === 0 && !isLoading"
                class="col-span-full font-bold mt-12">
                <img
                    src="/icons/empty-giveaways.svg"
                    alt="Empty Giveaways"
                    class="w-96 mx-auto" />
                <p class="text-gray-500 text-2xl text-center mt-6">Розіграшів не знайдено</p>
                <div class="w-full mx-auto text-center items-center justify-center">
                    <Button
                        @click="handleOpenCreateGiveaway"
                        class="mt-6">
                        <Gift class="w-5 h-5 text-white" />
                        Створити розіграш
                    </Button>
                </div>
            </div>
        </div>

        <GiveawayCreatePopup
            name="Створити розіграш"
            v-if="createGiveaway"
            @close="handleCloseCreateGiveaway"
            :createGiveaway="createGiveaway" />
    </AdminLayout>
</template>

<script setup lang="ts">
import { Gift } from "lucide-vue-next";
import { useGiveawayStore } from "~/store/giveawayStore";
import { useTabStore } from "~/store/tabStore";

const giveawayStore = useGiveawayStore();
const tabStore = useTabStore();

const { giveaways, isLoading } = storeToRefs(giveawayStore);
const { activeTab } = storeToRefs(tabStore);

const createGiveaway = ref(false);

const handleOpenCreateGiveaway = () => {
    createGiveaway.value = true;
};

const handleCloseCreateGiveaway = () => {
    createGiveaway.value = false;
};

const filteredGiveaways = computed(() => {
    return giveaways?.value?.filter((giveaway) => giveaway.status === activeTab.value) || [];
});

const giveawaysByStatus = computed(() => {
    if (!giveaways.value) return {};

    return giveaways?.value?.reduce((acc, giveaway) => {
        acc[giveaway.status] = (acc[giveaway.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
});

await giveawayStore.fetchGiveaways();
</script>

<style></style>