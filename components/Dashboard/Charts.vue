<template>
    <div>
        <div class="mt-6">
            <div
                v-if="hasNoData"
                class="h-[350px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p class="text-lg text-gray-500">Дані ще не готові</p>
            </div>
            <div v-else class="relative bg-white p-4 rounded-lg shadow">
                <ClientOnly>
                    <apexchart
                        type="area"
                        height="350"
                        :options="chartOptions"
                        :series="series"
                    />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IHistoryData } from "~/types/stats.type";

const props = defineProps<{ historyStats: IHistoryData }>();

const hasNoData = computed(() => {
    return !props.historyStats?.history?.length;
});

const processedData = computed(() => {
    if (!props.historyStats?.history) return { dates: [], values: [], growth: [] };

    const sortedData = [...props.historyStats.history].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return {
        dates: sortedData.map(item => new Date(item.timestamp).toLocaleString('uk-UA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })),
        values: sortedData.map(item => item.subscribers),
        growth: sortedData.map(item => item.subscribers_growth)
    };
});

const series = computed(() => [{
    name: 'Підписники',
    data: processedData.value.values
}]);

const yAxisRange = computed(() => {
    if (!processedData.value.values.length) return { min: 0, max: 0 };

    const values = processedData.value.values;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const diff = max - min;

    if (diff < max * 0.2) {
        const padding = max * 0.25;
        return {
            min: Math.floor(min - padding),
            max: Math.ceil(max + padding)
        };
    }

    const padding = diff * 0.1;
    return {
        min: Math.floor(min - padding),
        max: Math.ceil(max + padding)
    };
});

const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
        }
    },
    dataLabels: {
        enabled: true
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100]
        }
    },
    colors: ['#6734ff'],
    xaxis: {
        categories: processedData.value.dates,
        labels: {
            rotate: -45,
            style: {
                fontSize: '12px',
                fontWeight: 500
            },
            offsetY: 5
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tickPlacement: 'on'
    },
    yaxis: {
        min: yAxisRange.value.min,
        max: yAxisRange.value.max,
        tickAmount: 5,
        labels: {
            formatter: (value: number) => Math.round(value),
            style: {
                fontSize: '12px',
                fontWeight: 500
            }
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: (value: number, { dataPointIndex }: { dataPointIndex: number }) => {
                const growth = processedData.value.growth[dataPointIndex];
                const growthText = growth !== 0 ? ` (${growth > 0 ? '+' : ''}${growth})` : '';
                return `${value.toLocaleString()}${growthText}`;
            }
        },
        theme: 'light',
        style: {
            fontSize: '12px'
        }
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        padding: {
            top: 20,
            right: 0,
            bottom: 0,
            left: 10
        }
    },
    markers: {
        size: 5,
        strokeWidth: 2,
        fillOpacity: 1,
        strokeOpacity: 1,
        hover: {
            size: 8
        }
    }
}));
</script>