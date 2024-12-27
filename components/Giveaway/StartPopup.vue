<template>
    <Transition name="fade">
        <div
            v-if="startGiveaway"
            class="fixed inset-0 z-50 flex items-center justify-center">
            <div
                class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                @click="$emit('close')" />

            <div class="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10">
                <button
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    @click="$emit('close')">
                    <X class="w-6 h-6" />
                </button>

                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Запуск розіграшу – {{ name }}</h3>

                    <div
                        class="mt-4"
                        v-if="!isLoading">
                        <p class="text-sm text-gray-500">
                            Після запуску розіграшу його вже не можна редагувати. Перевірте всі дані перед запуском.
                        </p>
                        <div class="space-y-4 mt-6">
                            <div class="flex items-center text-sm text-slate-500">
                                <CalendarCheck class="w-5 h-5 mr-2" />
                                <span class="text-slate-800">Початок: {{ formatDateTable(startDate) }}</span>
                            </div>
                            <div class="flex items-center text-sm text-slate-500">
                                <CalendarClock class="w-5 h-5 mr-2" />
                                <span class="text-slate-800">Кінець: {{ formatDateTable(endDate) }}</span>
                            </div>
                            <div class="flex items-center text-sm text-slate-500">
                                <Gift class="w-5 h-5 mr-2" />
                                <span class="text-slate-800">Приз: {{ prize }}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="flex justify-center items-center h-[252px]">
                        <Loader size="lg" />
                    </div>
                </div>

                <div
                    v-if="!isLoading"
                    class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                    <Button @click="$emit('confirm')"> Запустити </Button>
                    <Button
                        variant="secondary"
                        @click="$emit('close')">
                        Скасувати
                    </Button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { X, CalendarCheck, CalendarClock, Gift } from "lucide-vue-next";

defineProps<{
    name: string;
    startGiveaway: boolean;
    isLoading: boolean;
    startDate: string;
    endDate: string;
    prize: string;
}>();

defineEmits<{
    (e: "close"): void;
    (e: "confirm"): void;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
