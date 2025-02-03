<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="flex flex-col gap-6 md:gap-0 md:flex-row justify-between">
                <div class="flex flex-col gap-4">
                    <h1 class="text-2xl font-bold text-slate-900">{{ giveaway?.title }}</h1>
                    <p class="text-slate-600">{{ giveaway?.description }}</p>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-2">
                            <CalendarCheck class="w-6 h-6 text-slate-600" />
                            <p class="text-slate-600">
                                Дата початку розіграшу:
                                <span class="font-bold text-slate-800">{{
                                    giveaway?.startDate ? DateUtils.formatDate(new Date(giveaway?.startDate)) : ""
                                }}</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <CalendarClock class="w-6 h-6 text-slate-600" />
                            <p class="text-slate-600">
                                Дата завершення розіграшу:
                                <span class="font-bold text-slate-800">{{
                                    giveaway?.endDate ? DateUtils.formatDate(new Date(giveaway?.endDate)) : ""
                                }}</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <CircleUser class="w-6 h-6 text-slate-600" />
                            <p class="text-slate-600">
                                Створив розіграш:
                                <span class="text-slate-800 font-bold">{{ giveaway?.createdBy?.username }}</span>
                            </p>
                        </div>

                        <div class="flex items-center mt-4 justify-between">
                            <div>
                                <div class="flex items-center gap-2">
                                    <p class="font-bold text-slate-600">Статус:</p>
                                    <span
                                        class="px-3 py-1 rounded-full text-sm font-bold"
                                        :class="{
                                            'bg-yellow-100 text-yellow-800 border border-yellow-300': giveaway?.status.toLocaleLowerCase() === 'draft',
                                            'bg-green-100 text-green-700 border border-green-300': giveaway?.status.toLocaleLowerCase() === 'active',
                                            'bg-blue-100 text-blue-800 border border-blue-300': giveaway?.status.toLocaleLowerCase() === 'completed',
                                            'bg-red-100 text-red-800 border border-red-300': giveaway?.status.toLocaleLowerCase() === 'cancelled',
                                        }"
                                    >
                                        {{ statusText }}
                                    </span>
                                </div>
                            </div>
                            <!-- <Button @click="handleOpenEditGiveaway"> <Edit class="w-5 h-5" /> Редагувати </Button> -->
                        </div>
                    </div>
                </div>
                <div>
                    <NuxtImg
                        :src="giveaway?.imageUrl"
                        alt="Giveaway Image"
                        class="w-full h-fit md:h-64 object-fit-contain md:object-cover rounded-lg"
                        loading="lazy"
                        placeholder
                        format="webp"
                        v-if="!isLoading"
                    />
                    <div v-else class="flex items-center justify-center h-64 w-full bg-gray-100 rounded-lg min-w-[300px]">
                        <Loader size="xl" />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-2 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <GiveawayStatCard title="Залишилось" :value="durationStats.value" :subtext="durationStats.subtext" :icon="CalendarClock" />
                <GiveawayStatCard
                    title="Повідомлень"
                    :value="giveaway?.messages.length"
                    :subtext="`Повідомлень про розіграш`"
                    :icon="Send"
                />
                <GiveawayStatCard title="Учасники" :value="giveaway?.participantsCount" :subtext="`Всього учасників`" :icon="UsersRound" />
            </div>

            <GiveawayParticipantsTable :giveawayId="giveaway?.id" />

            <div>
                <h3 class="text-xl font-bold mt-10">Останні повідомлення по розіграшу</h3>

                <div class="mt-6 md:ml-10 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <MessageItem v-for="message in giveaway?.messages" :key="message.id" :message="message" />
                </div>
            </div>
        </div>

        <!-- <Dialog v-model:open="openEditGiveaway">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редагувати розіграш – {{ giveaway?.title }}</DialogTitle>
                </DialogHeader>

                <form
                    @submit.prevent="handleSubmit"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="title">Назва розіграшу</Label>
                        <Input
                            id="title"
                            v-model="form.title"
                            :placeholder="giveaway?.title"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="description">Опис</Label>
                        <Textarea
                            id="description"
                            v-model="form.description"
                            :placeholder="giveaway?.description"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="startDate">Дата початку</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                v-model="form.startDate"
                                :disabled="giveaway?.status !== 'DRAFT'"
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
                        <Label for="imageUrl">Зображення</Label>
                        <Input
                            id="imageUrl"
                            v-model="form.imageUrl"
                            placeholder="Введіть посилання на зображення"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="status">Статус</Label>
                        <Select
                            v-model="form.status"
                            @update:modelValue="handleStatusChange">
                            <SelectTrigger>
                                <SelectValue :placeholder="giveawayStatuses.find((s:any) => s.value === form.status)?.label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        v-for="status in giveawayStatuses"
                                        :key="status.value"
                                        :value="status.value">
                                        {{ status.label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter class="w-full flex lg:justify-between">
                        <Button
                            type="button"
                            variant="secondary"
                            @click="openEditGiveaway = false">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isLoading">
                            {{ isLoading ? "Збереження..." : "Зберегти" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog> -->

        <Toaster />
    </AdminLayout>
</template>

<script setup lang="ts">
import { CalendarCheck, CalendarClock, CircleUser, Edit, Send, UsersRound } from "lucide-vue-next";
import { differenceInDays } from "date-fns";
import { useToast } from "~/components/ui/toast/use-toast";
import type { IGiveaway } from "~/types/giveaway.type";
import { useGiveawayStore } from "~/store/giveawayStore";

const giveawayStore = useGiveawayStore();
const { giveawayById: giveaway, isLoading } = storeToRefs(giveawayStore);

interface IGiveawayForm {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    status: string;
}

interface ApiResponse {
    data: {
        giveaway: IGiveaway;
    };
    success: boolean;
}

interface ErrorResponse {
    error: string;
    success: boolean;
}

const route = useRoute();
const config = useRuntimeConfig();
const { toast } = useToast();

const openEditGiveaway = ref(false);
const token = useCookie("token");

const giveawayStatuses = [
    { value: "draft", label: "Чернетка" },
    { value: "active", label: "Активний" },
    { value: "completed", label: "Завершений" },
    { value: "cancelled", label: "Скасований" },
];

const originalForm = ref<IGiveawayForm | null>(null);
const form = ref<IGiveawayForm>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    status: "draft",
});

const handleStatusChange = (newStatus: string) => {
    form.value.status = newStatus;
};

const handleOpenEditGiveaway = () => {
    if (giveaway.value) {
        const initialForm = {
            title: giveaway.value?.title || "",
            description: giveaway.value?.description || "",
            startDate: formatDate(giveaway.value?.startDate),
            endDate: formatDate(giveaway.value?.endDate),
            imageUrl: giveaway.value?.imageUrl || "",
            status: giveaway.value?.status,
        };
        form.value = { ...initialForm };
        originalForm.value = { ...initialForm };
    }
    openEditGiveaway.value = true;
};

const getModifiedFields = () => {
    if (!originalForm.value) return {};

    const modified: Partial<IGiveawayForm> = {};

    (Object.keys(form.value) as Array<keyof IGiveawayForm>).forEach((key) => {
        const currentValue = key === "status" ? form.value.status : form.value[key];
        if (currentValue !== originalForm.value?.[key]) {
            modified[key] = currentValue;
        }
    });

    return modified;
};

const handleSubmit = async () => {
    isLoading.value = true;
    try {
        const modifiedData = getModifiedFields();

        if (modifiedData.startDate || modifiedData.endDate) {
            const startDate = new Date(modifiedData.startDate || form.value.startDate);
            const endDate = new Date(modifiedData.endDate || form.value.endDate);

            if (!validateDates(startDate, endDate)) {
                toast({
                    title: "Помилка",
                    description: "Дата початку повинна бути менше дати закінчення та не раніше поточної дати",
                    variant: "destructive",
                });
                return;
            }
        }

        const response = await $fetch<ApiResponse>(`/api/giveaways/${giveaway.value?.id}`, {
            method: "PUT",
            body: {
                ...modifiedData,
                status: form.value.status,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.success) {
            openEditGiveaway.value = false;
            await giveawayStore.fetchGiveawayById(Number(route.params.id));
            toast({
                title: "Успіх",
                description: "Розіграш успішно оновлено",
                variant: "default",
            });
        }
    } catch (error: any) {
        console.error("Error:", error);
        let errorMessage = "Помилка при оновленні розіграшу";

        if (error.response) {
            const responseData = (await error.response._data) as ErrorResponse;
            errorMessage = responseData.error;
        }

        toast({
            title: "Помилка",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        isLoading.value = false;
    }
};

const durationStats = computed(() => {
    if (!giveaway.value) return { value: "0 днів", subtext: "Всього 0 днів" };

    const now = new Date();
    const totalDays = differenceInDays(new Date(giveaway.value?.endDate), new Date(giveaway.value?.startDate));
    const remainingDays = differenceInDays(new Date(giveaway.value?.endDate), now);

    return {
        value: `${remainingDays} днів`,
        subtext: `Всього ${totalDays} днів`,
    };
});

const statusText = computed(() => {
    const statusMap = {
        draft: "Черновик",
        active: "Активний",
        completed: "Завершений",
        cancelled: "Відменений",
    } as const;
    return statusMap[(giveaway.value?.status?.toLowerCase() ?? "draft") as keyof typeof statusMap];
});

watch(
    () => form.value.status,
    (newStatus, oldStatus) => {
        console.log("Status changed:", { old: oldStatus, new: newStatus });
    },
);

await giveawayStore.fetchGiveawayById(Number(route.params.id));
</script>
