<template>
    <AdminLayout>
        <h2 class="text-2xl font-bold text-gray-900">Створити повідомлення в Telegram</h2>
        <p class="text-gray-600 mt-2">Публікація розіграшу на канал.</p>
        <div
            class="mt-8 flex justify-between"
            v-if="!isLoading">
            <div class="w-full">
                <h3 class="text-lg font-semibold mb-4">Створення повідомлення</h3>
                <div class="p-4 md:p-6 rounded-2xl bg-white shadow-md w-full max-w-[550px] h-fit">
                    <form
                        @submit.prevent="handleSubmit"
                        class="">
                        <Label
                            for="message"
                            class="text-lg"
                            >Повідомлення:</Label
                        >
                        <ClientOnly>
                            <Label class="block mt-4 mb-4 font-bold">Текст статті</Label>
                            <QuillEditor
                                theme="snow"
                                v-model:content="form.content"
                                contentType="html"
                                :toolbar="['bold', 'italic', 'link']" />
                        </ClientOnly>
                        <div class="mt-4">
                            <Label for="imageUrl">Посилання на зображення:</Label>
                            <Input
                                class="mt-2"
                                v-model="form.imageUrl"
                                id="imageUrl"
                                type="url"
                                required />
                        </div>
                        <div class="mt-4">
                            <Label for="buttonText">Текст кнопки:</Label>
                            <Input
                                v-model="form.buttonText"
                                id="buttonText"
                                type="text"
                                class="mt-2"
                                required />
                        </div>
                        <div class="mt-4">
                            <Label
                                for="buttonText"
                                class="mb-2 block"
                                >Обрати розіграш</Label
                            >
                            <Select v-model:modelValue="form.giveawayId">
                                <SelectTrigger>
                                    <SelectValue placeholder="Оберіть розіграш" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="item in giveawayData"
                                            :value="item.id.toString()"
                                            :key="item.id">
                                            {{ item.title }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="w-full flex justify-center mt-6 min-w-[187px]">
                            <Button
                                type="submit"
                                :disabled="isLoading">
                                <Loader
                                    v-if="isLoading"
                                    size="md"
                                    className="mr-2" />
                                <span>{{ isLoading ? "" : "Відправити в Telegram" }}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="w-full">
                <h3 class="text-lg font-semibold mb-4">Попередній перегляд</h3>
                <MessageItem :message="form" />
            </div>
        </div>

        <div
            class="fixed inset-0 flex items-center justify-center z-50"
            v-else>
            <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
            <div class="relative">
                <Loader
                    size="lg"
                    className="text-white" />
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import type { IMessageForm } from "~/types/giveaway.type";
import { useGiveawayStore } from "~/store/giveawayStore";

const isLoading = ref(false);

const giveawayStore = useGiveawayStore();

const { activeGiveaways: giveawayData } = storeToRefs(giveawayStore);

const form = ref<IMessageForm>({
    content: "",
    imageUrl: "",
    buttonText: "",
    giveawayId: "",
    messageId: 0
});

if (!import.meta.server) {
    const { QuillEditor } = await import("@vueup/vue-quill");
    const { vueApp } = useNuxtApp();
    vueApp.component("QuillEditor", QuillEditor);
}

const handleSubmit = async (event: Event) => {
    event.preventDefault();
    isLoading.value = true;
    try {
        const response = await giveawayStore.createMessage({
            ...form.value,
            giveawayId: Number(form.value.giveawayId)
        });

        if (response.success) {
            toast({
                title: "Успіх",
                description: "Повідомлення успішно відправлено в Telegram"
            });

            form.value = {
                content: "",
                imageUrl: "",
                buttonText: "",
                giveawayId: "",
                messageId: 0
            };
        } else {
            throw new Error(response.error);
        }
    } catch (error: any) {
        toast({
            title: "Помилка",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        isLoading.value = false;
    }
};

await giveawayStore.fetchActiveGiveaways();
</script>

<style>
.telegram-preview {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.ql-editor {
    min-height: 200px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}
</style>
