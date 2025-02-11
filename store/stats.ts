import { defineStore } from "pinia";
import type { IDailyStats, IHotStats, IStats } from "~/types/stats.type";

export const useStatsStore = defineStore("stats", () => {
    const { data: stats, status, error, refresh } = useAsyncData(
        'channel-stats',
        async () => {
            try {
                const response = await $fetch<{success: boolean, data: IStats}>('https://tg.wogiveaway.shop/channels/woukraine/stats');
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error('Failed to fetch stats');
            } catch (e: any) {
                throw new Error(e.message || 'Помилка завантаження');
            }
        },
        {
            watch: [],
            server: false,
            transform: (response) => response as IStats
        }
    );

    const { data: dailyStats, status: dailyStatsStatus, error: dailyStatsError, refresh: refreshDailyStats } = useAsyncData(
        'daily-stats',
        async () => {
            try {
                const response = await $fetch<{success: boolean, data: IDailyStats}>('https://tg.wogiveaway.shop/channels/woukraine/reports/daily');
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error('Failed to fetch daily stats');
            } catch (e: any) {
                throw new Error(e.message || 'Помилка завантаження');
            }
        },
        {
            watch: [],
            server: false,
            transform: (response) => response as IDailyStats
        }
    );

    return {
        stats,
        status,
        error,
        refresh,
        dailyStats,
        dailyStatsStatus,
        dailyStatsError,
        refreshDailyStats
    }
});
