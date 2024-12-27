<template>
    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                        'bg-green-500': message.giveaway.status === 'ACTIVE',
                        'bg-blue-500': message.giveaway.status === 'COMPLETED',
                        'bg-red-500': message.giveaway.status === 'CANCELLED',
                        'bg-gray-500': message.giveaway.status === 'DRAFT'
                    }"></div>
                <span
                    class="text-sm font-medium"
                    :class="{
                        'text-green-700': message.giveaway.status === 'ACTIVE',
                        'text-blue-700': message.giveaway.status === 'COMPLETED',
                        'text-red-700': message.giveaway.status === 'CANCELLED',
                        'text-gray-700': message.giveaway.status === 'DRAFT'
                    }">
                    {{ statusText }}
                </span>
            </div>
            <time
                :datetime="message.createdAt"
                class="text-sm text-gray-500">
                {{ formatDate(message.createdAt) }}
            </time>
        </div>

        <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 line-clamp-1">
                {{ message.giveaway.title }}
            </h3>

            <div
                v-if="message.imageUrl"
                class="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
                <NuxtImg
                    :src="message.imageUrl"
                    :alt="message.giveaway.title"
                    class="absolute inset-0 w-full h-full object-cover"
                    placeholder
                    format="webp" />
            </div>

            <div class="prose prose-sm max-w-none mb-4">
                <p
                    class="text-gray-600 line-clamp-3 whitespace-pre-line"
                    v-html="message?.content"></p>
            </div>

            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                    <CalendarDays class="w-4 h-4 mr-2" />
                    {{ formatDateRange(message.giveaway.startDate, message.giveaway.endDate) }}
                </div>

                <div class="flex items-center text-sm text-gray-600">
                    <Gift class="w-4 h-4 mr-2" />
                    {{ message.giveaway.prize }}
                </div>
            </div>

            <div
                v-if="message.buttonText"
                class="mb-4">
                <div class="text-xs text-gray-500 mb-1.5">Кнопка в повідомленні:</div>
                <span class="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                    {{ message.buttonText }}
                </span>
            </div>
        </div>

        <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
							<TooltipProvider :delayDuration="100">
								<Tooltip>
								<TooltipTrigger as-child>
									<div>
										{{ message?.giveaway?.createdBy?.username[0].toUpperCase()}}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{{message?.giveaway?.createdBy?.username}}</p>
								</TooltipContent>
								</Tooltip>
							</TooltipProvider>
                        </div>
                    </div>

                    <div class="flex items-center text-sm text-gray-600">
                        
						<TooltipProvider :delayDuration="100">
								<Tooltip>
								<TooltipTrigger as-child>
									<div class="flex items-center space-x-1">
										<UsersRound class="w-4 h-4 mr-1.5" />
										{{ message?.giveaway?.participantsCount}}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p> Учасників: {{message?.giveaway?.participantsCount}}</p>
								</TooltipContent>
								</Tooltip>
							</TooltipProvider>
                    </div>
                </div>

                <Button size="sm">Переглянути</Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IMessage } from "~/types/giveaway.type";
import { UsersRound, Gift, CalendarDays } from "lucide-vue-next";

const props = defineProps<{
    message: IMessage;
}>();

const formatDate = (date: string) => {
    return new Date(date).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "short"
    })} - ${end.toLocaleDateString("uk-UA", { day: "2-digit", month: "short" })}`;
};

const statusText = computed(() => {
    const statusMap = {
        draft: "Відкладений",
        active: "Активний",
        completed: "Завершений",
        cancelled: "Скасований"
    } as const;
    return statusMap[(props.message?.giveaway?.status.toLowerCase() ?? "draft") as keyof typeof statusMap];
});
</script>
