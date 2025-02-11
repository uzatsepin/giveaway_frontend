<template>
    <AdminLayout>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Дашбоард</h1>
            <p class="mt-2 text-sm text-muted-foreground">Тут можна переглянути всі основні показники вашого каналу</p>
        </div>
        <DashboardTopCards v-if="historyStats"
            :historyStats="historyStats"
            :selectedPeriod="selectedPeriod" />

        <div class="mt-8">
            <h2 class="text-2xl font-bold text-gray-900">Розіграші</h2>
            <div class="mt-6">
                <DashboardGiveaways :giveaways="giveaways" />
            </div>
        </div>
        
        <div class="mt-8">
            <h2 class="text-2xl font-bold text-gray-900">Статистика підписників</h2>
            <div class="mt-6">
                <div class="flex flex-col gap-4">
                    <div class="w-fit rounded-lg border border-gray-200 bg-white h-fit">
                        <button v-for="period in periods"
                            :key="period.value"
                            @click="handlePeriodChange(period.value)"
                            :class="[
                                'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                                selectedPeriod === period.value ? 'bg-[#6734ff] text-white' : 'text-gray-500 hover:text-gray-700'
                            ]">
                            {{ period.label }}
                        </button>
                    </div>
                </div>
                <DashboardCharts 
                    v-if="historyStats && historyStatus === 'success'"
                    :historyStats="historyStats" />
                <div v-else>
                    <Loader size="xl" />
                </div>
            </div>
        </div>
        <div class="mt-8">
            <h2 class="text-2xl font-bold text-gray-900">Перевірити інший канал</h2>
            <DashboardCheckChannel />
        </div>
        <!-- <div class="mt-8">
            <h2 class="text-2xl font-bold text-gray-900">Статистика каналу</h2>
            <DashboardChannelStats />
        </div> -->
    </AdminLayout>
</template>

<script setup lang="ts">
import { useGiveawayStore } from '~/store/giveawayStore';
import type { IHistoryData } from '~/types/stats.type';

const giveawayStore = useGiveawayStore();
const { giveaways } = storeToRefs(giveawayStore);

const periods = [
    { label: 'День', value: '1d' },
    { label: '7 днів', value: '7d' },
    { label: '30 днів', value: '30d' }
];

const selectedPeriod = ref('1d');

const { data: historyStats, refresh: refreshHistory, status: historyStatus } = await useAsyncData("historyStats", async () => {
    const response = await $fetch<{ success: true; data: IHistoryData }>(
        `https://tg.wogiveaway.shop/channels/woukraine/history?period=${selectedPeriod.value}`
    );
    return response.data;
});

const handlePeriodChange = async (period: string) => {
    selectedPeriod.value = period;
    await refreshHistory();
};
</script>

<style></style>
