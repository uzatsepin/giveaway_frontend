<template>
    <Transition name="fade">
        <div
            v-if="createGiveaway"
            class="fixed inset-0 z-50 flex items-center justify-center">
            <div
                class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                @click="$emit('close')" />

            <div
                class="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                v-if="!isLoading">
                <button
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    @click="$emit('close')">
                    <X class="w-6 h-6" />
                </button>

                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        {{ name }}
                    </h3>
                </div>

                <form class="space-y-4 mt-6">
                    <div class="space-y-2">
                        <Label for="title">Назва розіграшу</Label>
                        <Input
                            id="title"
                            v-model="form.title"
                            placeholder="Введіть назву розіграшу"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="description">Опис</Label>
                        <Textarea
                            id="description"
                            v-model="form.description"
                            placeholder="Введіть опис розіграшу"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="startDate">Дата початку</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                v-model="form.startDate"
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="endDate">Дата завершення</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                v-model="form.endDate"
                                required />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="prize">Приз</Label>
                        <Input
                            id="prize"
                            v-model="form.prize"
                            placeholder="Введіть приз"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="prize">Зображення</Label>
                        <Input
                            id="prize"
                            v-model="form.imageUrl"
                            placeholder="Введіть посилання на товар"
                            required />
                    </div>

                    <div
                        v-if="errorMessage"
                        class="text-red-500 text-sm">
                        {{ errorMessage }}
                    </div>
                </form>

                <div
                    v-if="!isLoading"
                    class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                    <Button @click="handleSubmit"> Створити розіграш </Button>
                    <Button
                        variant="secondary"
                        @click="$emit('close')">
                        Скасувати
                    </Button>
                </div>
            </div>
            <div
                class="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10"
                v-else>
                <div class="flex items-center justify-center h-[536px]">
                    <Loader size="xl"/>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import type { IGiveawayForm } from "~/types/giveaway.type";
import { X } from "lucide-vue-next";
import { toast } from "~/components/ui/toast";
import { useGiveawayStore } from "~/store/giveawayStore";
import { useTabStore } from "~/store/tabStore";

const giveawayStore = useGiveawayStore();
const tabStore = useTabStore();
const isLoading = ref(false);

const { errorMessage } = storeToRefs(giveawayStore);

const form = ref<IGiveawayForm>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    prize: "",
    imageUrl: ""
});

defineProps<{
    name: string;
    createGiveaway: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const handleSubmit = async () => {
    isLoading.value = true;
    try {
        const result = await giveawayStore.createGiveaway(form.value);

        if (result.success) {
            emit("close");
            form.value = {
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                prize: "",
                imageUrl: ""
            };

            toast({
                title: "Успіх",
                description: "Розіграш успішно створено",
                variant: "default"
            });
            await giveawayStore.fetchGiveaways();
            tabStore.setActiveTab("DRAFT");
        } else {
            toast({
                title: "Помилка",
                description: result.error,
                variant: "destructive"
            });
        }
    } catch (error: any) {
        console.log(error);
        
        const errorMessage = error.message || "Помилка створення розіграшу";
        toast({
            title: "Помилка",
            description: errorMessage,
            variant: "destructive"
        });
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
