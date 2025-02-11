<template>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> Всього підписників </CardTitle>
                <UserRoundPlus class="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{{ historyStats?.current_subscribers.toLocaleString("uk") }}</div>
                <p
                    class="text-sm font-bold mt-2"
                    :class="{
                        'text-green-500': (historyStats?.summary?.total_subscriber_growth ?? 0) > 0,
                        'text-red-500': (historyStats?.summary?.total_subscriber_growth ?? 0) < 0,
                        'text-gray-900': (historyStats?.summary?.total_subscriber_growth ?? 0) === 0
                    }">
                    {{
                        (historyStats?.summary?.total_subscriber_growth ?? 0) > 0
                            ? `+${historyStats?.summary?.total_subscriber_growth ?? 0}`
                            : historyStats?.summary?.total_subscriber_growth ?? 0
                    }}
                    <span class="text-muted-foreground font-normal">
                        {{ periodText }}
                    </span>
                </p>
                <p class="text-xs text-muted-foreground mt-2">
                    Остання перевірка – {{ formatDateCard(historyStats?.history[historyStats.history.length - 1]?.timestamp ?? "") }}
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> Переглядів в середньому </CardTitle>
                <Eye class="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{{ channelStats?.average_views }}</div>
                <p class="text-xs text-muted-foreground mt-2">Средня кількість переглядів постів</p>
                <p class="text-xs text-muted-foreground mt-2">Останні 100 дописів</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> % переглядів </CardTitle>
                <ChartPie class="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{{ channelStats?.engagement_rate.toFixed(0) }} %</div>
                <p class="text-xs text-muted-foreground mt-2">Відсоток підписників переглядають пости</p>
                <p class="text-xs text-muted-foreground mt-2">Останні 100 дописів</p>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import type { IStats, IHistoryData } from "~/types/stats.type";
import { UserRoundPlus, Eye, ChartPie } from "lucide-vue-next";

const props = defineProps<{ 
    historyStats: IHistoryData;
    selectedPeriod?: string;
}>();

const periodText = computed(() => {
    switch (props.selectedPeriod) {
        case '7d':
            return 'за 7 днів';
        case '30d':
            return 'за 30 днів';
        default:
            return 'за день';
    }
});

const { data: channelStats, status: statsStatus } = useAsyncData("stats", async () => {
    const response = await $fetch<{ success: true; data: IStats }>("https://tg.wogiveaway.shop/channels/woukraine/stats");
    return response.data;
});
</script>
