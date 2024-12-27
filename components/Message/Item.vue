<template>
    <div class="telegram-preview rounded-2xl border bg-white shadow-md p-4 max-w-[450px] h-full flex flex-col">
        <div class="flex items-center mb-2 relative">
            <div class="flex items-center justify-between w-full">
                <p class="flex items-center gap-2">
                    <span class="font-bold">WO.UA</span>
                    <NuxtImg
                        src="/icons/verified.svg"
                        class="w-6 h-6" />
                </p>
                <p>
                    <NuxtImg
                        src="/icons/tg-icon.svg"
                        class="w-6 h-6" />
                </p>
            </div>
            <div class="absolute -left-14 hidden md:block">
                <NuxtImg
                    src="/icons/wo-logo.svg"
                    class="rounded-full w-8 h-8 object-cover" />
            </div>
        </div>

        <img
            v-if="message.imageUrl"
            :src="message.imageUrl"
            alt="Preview"
            class="w-full object-cover rounded-lg mb-3 mt-4" />

        <div
            class="text-[#000000] text-[15px] leading-[19px] whitespace-pre-wrap mb-2"
            v-html="message.content" />

        <div
            v-if="message.buttonText"
            class="mt-auto pt-4">
            <div class="inline-flex items-center justify-center w-full">
                <button
                    class="w-full bg-[#f1f1f1] hover:bg-[#e3e3e3] transition-colors duration-200 text-[#2481cc] font-medium px-4 py-2 rounded-lg text-sm">
                    {{ message.buttonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    message: {
        imageUrl: string;
        content: string;
        buttonText: string;
    };
}>();
</script>

<style scoped></style>
