<template>
    <div class="px-4 mb-6">
        <ul>
            <li class="flex items-center justify-center gap-2 py-2 text-muted-foreground">
                <UserRoundCheck class="w-5 h-5" />
                Підписників:
                <div v-if="status === 'pending'" class="flex items-center">
                    <Loader size="sm" />
                </div>
                <p v-else-if="status === 'error'" class="text-destructive text-sm">
                    {{ error }}
                </p>
                <p v-else-if="status === 'success'" class="text-foreground">
                    {{ stats?.participants_count?.toLocaleString('uk') }}
                </p>
            </li>
            <!-- <li class="flex items-center gap-2 py-2 text-muted-foreground border-b border-slate-200">
                <Eye class="w-5 h-5" />
                Переглядів:
                <p class="text-foreground font-bold ml-auto">
                    {{ stats.total_views }}
                </p>
            </li>
            <li class="flex items-center gap-2 py-2 text-muted-foreground">
                <MousePointerClick class="w-5 h-5" />
                Взаємодія:
                <p class="text-foreground font-bold ml-auto">{{ stats.engagement_rate }}%</p>
            </li> -->
        </ul>
    </div>
</template>

<script setup lang="ts">
import {
    UserRoundCheck,
    Eye,
    MousePointerClick,
} from "lucide-vue-next";
import { useStatsStore } from "~/store/stats";

const statsStore = useStatsStore();
const { stats } = storeToRefs(statsStore);

const { status, error } = useAsyncData(
    'stats',
    async () => {
        try {
            await statsStore.fetchStats();
            return null;
        } catch (e: any) {
            return e.message || 'Помилка завантаження';
        }
    },
    {
        immediate: true,
        watch: []
    }
);
</script>
