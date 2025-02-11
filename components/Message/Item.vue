<template>
    <div class="telegram-preview rounded-2xl border bg-white shadow-md p-4 max-w-[550px] h-full flex flex-col">
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
        <div
            v-if="postStats"
            class="mt-4">
            <div class="flex items-center justify-between gap-2 pt-4 border-t border-[#e3e3e3]">
                <div class="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer group">
                    <TooltipProvider :delayDuration="100">
                        <Tooltip>
                        <TooltipTrigger as-child>
                            <div class="flex items-center gap-2">
                                <Eye class="w-5 h-5 group-hover:text-[#6734ff] transition-all duration-300"/>
                                <span class="font-bold text-foreground group-hover:text-[#6734ff] transition-all duration-300">{{ postStats.data.views }}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Загальна кількість переглядів: <span class="font-bold">{{ postStats.data.views }}</span></p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div class="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer group">
                    <TooltipProvider :delayDuration="100">
                        <Tooltip>
                        <TooltipTrigger as-child>
                            <div class="flex items-center gap-2">
                                <SmilePlus class="w-5 h-5 group-hover:text-[#6734ff] transition-all duration-300"/>
                                <span class="font-bold text-foreground group-hover:text-[#6734ff] transition-all duration-300">{{ postStats.data.reactions }}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Загальна кількість реакцій: <span class="font-bold">{{ postStats.data.reactions }}</span></p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div class="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer group">
                    <TooltipProvider :delayDuration="100">
                        <Tooltip>
                        <TooltipTrigger as-child>
                            <div class="flex items-center gap-2">
                                <Forward class="w-5 h-5 group-hover:text-[#6734ff] transition-all duration-300"/>
                                <span class="font-bold text-foreground group-hover:text-[#6734ff] transition-all duration-300">{{ postStats.data.forwards }}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Загальна кількість пересилань: <span class="font-bold">{{ postStats.data.forwards }}</span></p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Eye, Forward, SmilePlus } from 'lucide-vue-next';
interface IMessageStats {
    engagement_rate: number;
    forwards: number;
    reactions: number;
    views: number;
    replies: number;
}

const props = defineProps<{
    message: {
        imageUrl: string;
        content: string;
        buttonText: string;
        messageId: number;
    };
    giveawayPage?: boolean;
}>();

const { data:postStats, status } = await useAsyncData(`posts-stats-${props.message.messageId}`, async () => {
    if (!props.giveawayPage) return

    const response = await $fetch<{success: true, data: IMessageStats}>(`http://49.12.45.101:3005/channels/woukraine/posts/${props.message.messageId}/engagement`);
    return response
})


</script>

<style scoped></style>
