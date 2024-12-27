<template>
    <Transition name="fade">
        <div
            v-if="endGiveaway"
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
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Завершити розіграш – {{ name }}?</h3>

                    <div
                        class="mt-4"
                        v-if="!isLoading">
                        <p class="text-sm text-gray-500">
                            Ви дійсно хочете завершити розіграш?
                        </p>
                        <div class="mt-4">
                            <h3 class="">Кількість учасників цього розіграшу – <span class="font-bold">{{ participantsCount }}</span></h3>
                            <p class="mt-2 text-sm text-slate-500">Запланована дата завершення: <span class="block text-slate-800 font-bold">{{ formatDateTable(endDate) }}</span></p>
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
                    <Button @click="$emit('confirm')"> Завершити </Button>
                    <Button
                        variant="secondary"
                        @click="$emit('close')">
                        Закрити
                    </Button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps<{
    name: string;
    endGiveaway: boolean;
    isLoading: boolean;
    participantsCount: number;
    endDate: string;
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
