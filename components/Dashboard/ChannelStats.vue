<template>
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

        <div v-if="hasNoData"
            class="h-[350px] flex items-center justify-center bg-gray-50 rounded-lg mt-4">
            <p class="text-lg text-gray-500">Дані ще не готові</p>
        </div>
        <div v-else class="relative bg-white p-4 rounded-lg shadow mt-4">
            <ClientOnly>
                <apexchart
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series" />
            </ClientOnly>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface WeeklyStats {
    week: number;
    year: number;
    posts: number;
    views: number;
    forwards: number;
    replies: number;
    start_date: string;
    end_date: string;
}

interface WeeklyResponse {
    success: boolean;
    data: {
        current_week: string;
        weekly_stats: WeeklyStats[];
    };
}

const periods = [
    { label: 'По тижнях', value: 'weekly' },
    { label: 'По місяцях', value: 'monthly' }
];

const selectedPeriod = ref('weekly');

const { data: stats, refresh: refreshStats } = await useAsyncData('channelStats', async () => {
    const response = await $fetch<WeeklyResponse>(
        `https://tg.wogiveaway.shop/channels/woukraine/reports/${selectedPeriod.value}`
    );
    return response.data.weekly_stats;
});

const hasNoData = computed(() => !stats.value || stats.value.length === 0);

const series = computed(() => [
    {
        name: 'Пости',
        data: stats.value?.map(stat => stat.posts) || []
    },
    // {
    //     name: 'Перегляди',
    //     data: stats.value?.map(stat => stat.views) || []
    // },
    {
        name: 'Репости',
        data: stats.value?.map(stat => stat.forwards) || []
    },
]);

const chartOptions = computed(() => ({
    chart: {
        type: 'line',
        toolbar: {
            show: false
        }
    },
    colors: ['#6734ff', '#10b981', '#f59e0b', '#ef4444'],
    stroke: {
        curve: 'smooth',
        width: 2
    },
    xaxis: {
        categories: stats.value?.map(stat => {
            const startDate = new Date(stat.start_date);
            return startDate.toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' });
        }) || [],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        labels: {
            style: {
                fontSize: '12px',
                fontWeight: 500
            }
        }
    },
    yaxis: [
        {
            title: {
                text: 'Кількість'
            },
            labels: {
                formatter: (value: number) => Math.round(value)
            }
        }
    ],
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: (value: number) => Math.round(value)
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetY: -10,
        itemMargin: {
            horizontal: 10
        }
    }
}));

const handlePeriodChange = async (period: string) => {
    selectedPeriod.value = period;
    await refreshStats();
};

</script>