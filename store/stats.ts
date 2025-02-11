import { defineStore } from "pinia";
import type { IDailyStats, IHotStats, IStats } from "~/types/stats.type";

export const useStatsStore = defineStore("stats", () => {
    const dailyStats = ref({} as IDailyStats);
	const stats = ref({} as IStats);

	async function fetchDailyStats() {
		const response = await useFetch<{ success: boolean, data: IDailyStats }>('http://49.12.45.101:3005/channels/woukraine/reports/daily')
		dailyStats.value = response.data.value?.data|| {} as IDailyStats;
	}

	async function fetchStats() {
		const response = await useFetch<{success: boolean, data: IStats}>('http://49.12.45.101:3005/channels/woukraine/stats');
		stats.value = response.data.value?.data || {} as IStats
	}

	return {
		dailyStats,
		fetchDailyStats,
		stats,
		fetchStats
	}
});
