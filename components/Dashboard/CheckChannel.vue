<template>
    <h3>Тут можна перевірити базову статистику іншого каналу</h3>

    <div class="mt-6 flex gap-4 items-center">
        <Input
            class="bg-white max-w-[350px]"
            placeholder="Введіть посилання на канал (@woukraine)"
            v-model="inputValue" />
        <Button
            @click="checkChannel"
            :disabled="!inputValue.length"
            >Перевірити</Button
        >
    </div>

    <Transition>
        <Dialog v-model:open="openModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Базова статистика каналу – {{ inputValue }}</DialogTitle>
                </DialogHeader>

                <div class="py-4">
                    <!-- Loading State -->
                    <div
                        v-if="isLoading"
                        class="flex justify-center items-center min-h-[100px]">
                        <Loader size="lg" />
                    </div>

                    <!-- Data State -->
                    <div
                        v-else-if="channelData"
                        class="space-y-4">
						<p class="text-muted-foreground">
							Дані базуються на останніх 100 постах.
						</p>
						<div class="p-2 border border-slate-200 rounded-lg">
							<div class="flex items-center gap-4 w-full justify-between pb-2 px-2">
								<p class="font-medium">Підписників</p>
								<p class="font-bold">{{ channelData?.participants_count?.toLocaleString('uk') }}</p>
							</div>
							<div class="flex items-center gap-4 w-full justify-between py-2 px-2 border-t border-slate-200">
								<p class="font-medium">Всього переглядів</p>
								<p>{{ channelData?.total_views?.toLocaleString('uk') }}</p>
							</div>
							<div class="flex items-center gap-4 w-full justify-between py-2 px-2 border-t border-slate-200">
								<p class="font-medium">Середній перегляд постів</p>
								<p>{{ channelData?.average_views?.toLocaleString('uk') }}</p>
							</div>
							<div class="flex items-center gap-4 w-full justify-between py-2 px-2 border-t border-slate-200">
								<p class="font-medium">Макс.кількість переглядів</p>
								<p class="flex items-center gap-2">{{ channelData?.max_views?.toLocaleString('uk') }} 
									<TooltipProvider :delayDuration="100">
										<Tooltip>
										<TooltipTrigger as-child>
											<div class="flex items-center gap-2">
												<Info class="w-5 h-5 text-muted-foreground cursor-pointer hover:text-slate-900 transition-all duration-300" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p class="max-w-[230px]">Максимальна кількість переглядів на одному з останніх 100 дописів</p>
										</TooltipContent>
										</Tooltip>
									</TooltipProvider>		
								</p>
							</div>
							<div class="flex items-center gap-4 w-full justify-between py-2 px-2 border-t border-slate-200">
								<p class="font-medium">Відсоток залученості</p>
								<p class="flex items-center gap-2">
									{{ channelData?.engagement_rate?.toLocaleString('uk') }} %
									<TooltipProvider :delayDuration="100">
										<Tooltip>
										<TooltipTrigger as-child>
											<div class="flex items-center gap-2">
												<Info class="w-5 h-5 text-muted-foreground cursor-pointer hover:text-slate-900 transition-all duration-300" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p class="max-w-[230px]">Співвідношення підписників і переглядів. Скільки підписників дійсно читають канал</p>
										</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</p>
							</div>
						</div>
                        <!-- <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell class="font-medium">Підписників</TableCell>
                                    <TableCell>
										{{ channelData.participants_count.toLocaleString('uk') }}
									</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium">Всього переглядів</TableCell>
                                    <TableCell>{{ channelData.total_views }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium">Середній перегляд постів</TableCell>
                                    <TableCell>{{ channelData.average_views }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium">Макс. переглядів</TableCell>
                                    <TableCell>
										{{ channelData.max_views }}
									</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium">Рейтинг залученості</TableCell>
                                    <TableCell>{{ channelData.engagement_rate }}%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium">Макс. рейтинг залученості</TableCell>
                                    <TableCell>{{ channelData.max_engagement_rate }}%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table> -->
                    </div>

                    <!-- Error State -->
                    <div
                        v-else
                        class="text-red-500">
                        {{ errorMessage }}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </Transition>
</template>

<script lang="ts" setup>
import type { IStats } from "~/types/stats.type";
import { Info } from "lucide-vue-next";

const inputValue = ref<string>("");
const openModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const channelData = ref<IStats | null>(null);
const errorMessage = ref<string | null>(null);

const checkChannel = async () => {
    openModal.value = true;
    try {
        isLoading.value = true;
        const { data } = await $fetch<{ success: boolean; data: IStats }>(`https://tg.wogiveaway.shop/channels/${inputValue.value}/stats`);

        if (data) {
            channelData.value = data;
        } else {
            errorMessage.value = "Канал не знайдено";
        }
    } catch (error) {
        errorMessage.value = "Такого каналу не існує, або помилка завантаження даних. Перевірте, чи дійсно ви ввели посилання на канал у такому вигляді @woukraine";
    } finally {
        isLoading.value = false;
    }
};
</script>

<style></style>
