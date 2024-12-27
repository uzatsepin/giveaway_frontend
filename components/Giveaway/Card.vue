<template>
    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div class="relative">
            <!-- Status Badge -->
            <div
                class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                :class="{
                    'bg-yellow-100 text-yellow-800': giveaway.status.toLocaleLowerCase() === 'draft',
                    'bg-green-100 text-green-800': giveaway.status.toLocaleLowerCase() === 'active',
                    'bg-blue-100 text-blue-800': giveaway.status.toLocaleLowerCase() === 'completed',
                    'bg-red-100 text-red-800': giveaway.status.toLocaleLowerCase() === 'cancelled'
                }">
                {{ statusText }}
            </div>

            <div class="absolute top-4 right-4">
                <Button
                    @click="openConfirmDelete"
                    class="p-2 rounded-full min-w-[36px] min-h-[36px] group bg-red-100 hover:bg-red-200 transition-colors duration-300">
                    <Trash2 class="w-6 h-6 text-red-500 group-hover:text-red-600" />
                </Button>
            </div>
        </div>

        <NuxtImg
            :src="giveaway?.imageUrl"
            alt="Giveaway Image"
            class="max-h-64 mx-auto p-4"
            lazy
            placeholder
            format="webp"
            quality="80" />

        <div class="p-6 flex flex-col flex-grow">
            <div class="mb-4">
                <h3 class="text-xl font-bold text-slate-900 mb-2">{{ giveaway.title }}</h3>
                <p class="text-green-600 font-semibold">Приз: {{ giveaway.prize }}</p>
            </div>

            <p class="text-slate-600 mb-4 line-clamp-2">{{ giveaway.description }}</p>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-slate-50 p-3 rounded-lg">
                    <p class="text-sm text-slate-500">Учасники</p>
                    <p class="text-lg font-semibold text-slate-900">{{ giveaway.participantsCount }}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-lg">
                    <p class="text-sm text-slate-500">Статус</p>
                    <p class="text-lg font-semibold text-slate-900">{{ statusText }}</p>
                </div>
            </div>

            <div class="space-y-4 mb-4">
                <div class="flex items-center text-sm text-slate-500">
                    <CalendarCheck class="w-5 h-5 mr-2" />
                    <span>Початок: {{ formatDateTable(giveaway.startDate) }}</span>
                </div>
                <div class="flex items-center text-sm text-slate-500">
                    <CalendarClock class="w-5 h-5 mr-2" />
                    <span>Кінець: {{ formatDateTable(giveaway.endDate) }}</span>
                </div>
            </div>

            <div class="mt-auto flex flex-col gap-2">
                <Button class="w-full">
                    <NuxtLink
                        :to="`/admin/giveaways/${giveaway.id}`"
                        class="w-full h-full">
                        Детальніше
                    </NuxtLink>
                </Button>
                <Button
                    variant="outline"
                    class="w-full"
                    v-if="giveaway.status.toLowerCase() === 'draft'"
                    @click="openStartGiveaway">
                    <CirclePlay class="w-8 h-8"/>
                    Запустити
                </Button>
                <Button 
                    variant="secondary"
                    class="w-full"
                    v-if="giveaway.status.toLowerCase() === 'active'"
                    @click="openEndGiveaway">
                    <CirclePause class="w-8 h-8"/>
                    Завершити
                </Button>
            </div>
        </div>
    </div>
    <GiveawayDeletePopup
        :name="giveaway.title"
        :confirmDelete="confirmDelete"
        @close="closeConfirmDelete"
        @confirm="handleDeleteGiveaway" />

    <GiveawayStartPopup
        :name="giveaway.title"
        :startGiveaway="startGiveaway"
        :isLoading="createLoading"
        @close="closeStartGiveaway"
        @confirm="handleStartGiveaway"
        :startDate="giveaway.startDate"
        :endDate="giveaway.endDate"
        :prize="giveaway.prize" />

    <GiveawayEndPopup 
        :name="giveaway.title"
        :endGiveaway="endGiveaway"
        :isLoading="createLoading"
        @close="closeEndGiveaway"
        @confirm="handleEndGiveaway"
        :participantsCount="giveaway.participantsCount"
        :endDate="giveaway.endDate"
    />
</template>

<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2, CirclePause, CirclePlay } from "lucide-vue-next";
import { useGiveawayStore } from "~/store/giveawayStore";
import type { IGiveaway } from "~/types/giveaway.type";
import { toast } from "../ui/toast";
import { useTabStore } from "~/store/tabStore";
const giveawayStore = useGiveawayStore();
const tabStore = useTabStore();

const props = defineProps<{
    giveaway: IGiveaway;
}>();

const createLoading = ref(false);
const confirmDelete = ref(false);
const startGiveaway = ref(false);
const endGiveaway = ref(false);

const statusText = computed(() => {
    const statusMap: Record<"draft" | "active" | "completed" | "cancelled", string> = {
        draft: "В очікуванні",
        active: "Активний",
        completed: "Завершений",
        cancelled: "Відмінений"
    };
    return statusMap[props.giveaway.status.toLowerCase() as keyof typeof statusMap];
});

const openConfirmDelete = () => {
    confirmDelete.value = true;
};

const closeConfirmDelete = () => {
    confirmDelete.value = false;
};

const openStartGiveaway = () => {
    startGiveaway.value = true;
};

const closeStartGiveaway = () => {
    startGiveaway.value = false;
};

const openEndGiveaway = () => {
    endGiveaway.value = true;
};

const closeEndGiveaway = () => {
    endGiveaway.value = false;
};

const handleDeleteGiveaway = async () => {
    const result = await giveawayStore.deleteGiveaway(props.giveaway.id);

    if (!result.success) {
        toast({
            title: "Помилка",
            description: result.error || "Не вдалося видалити розіграш",
            variant: "destructive"
        });
        return;
    }
    await giveawayStore.fetchGiveaways();
    tabStore.setActiveTab("DRAFT");
    closeConfirmDelete();
};

const handleStartGiveaway = async () => {
    createLoading.value = true;
    try {
        const result = await giveawayStore.startGiveaway(props.giveaway.id);
        if (result.success) {
            toast({
                title: "Успіх",
                description: "Розіграш успішно запущено",
                variant: "default"
            });
            await giveawayStore.fetchGiveaways();
            tabStore.setActiveTab("ACTIVE");
            closeStartGiveaway();
        } else {
            throw new Error(result.error);
        }
    } catch (e: any) {
        toast({
            title: "Помилка",
            description: e.message,
            variant: "destructive"
        });
    } finally {
        createLoading.value = false;
    }
};

const handleEndGiveaway = async () => {
    createLoading.value = true;
    try {
        const result = await giveawayStore.endGiveaway(props.giveaway.id);
        if (result.success) {
            toast({
                title: "Успіх",
                description: "Розіграш успішно завершено",
                variant: "default"
            });
            await giveawayStore.fetchGiveaways();
            tabStore.setActiveTab("COMPLETED");
            closeEndGiveaway();
        } else {
            throw new Error(result.error);
        }
    } catch (e: any) {
        console.log(e);
        
        toast({
            title: "Помилка",
            description: e.message,
            variant: "destructive"
        });
    } finally {
        createLoading.value = false;
    }
}
</script>
