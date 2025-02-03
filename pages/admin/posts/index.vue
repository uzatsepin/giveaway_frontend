<template>
    <AdminLayout>
        <div class="min-h-screen">
            <div class="">
                <!-- Header -->
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900">Перегляд останніх повідомлень</h2>
                    <p class="mt-2 text-sm text-gray-700">Список всіх повідомлень, які були відправлені через телеграм бота</p>
                </div>

                <!-- Filters -->
                <div class="mb-6 flex flex-wrap gap-4">
                    <select
                        v-model="filters.status"
                        class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Всі статуси</option>
                        <option value="ACTIVE">Активні</option>
                        <option value="COMPLETED">Завершені</option>
                        <option value="CANCELLED">Скасовані</option>
                        <option value="DRAFT">Чернетки</option>
                    </select>

                    <input
                        v-model="filters.search"
                        type="search"
                        placeholder="Пошук по назві..."
                        class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <!-- Empty State -->
                <div
                    v-if="filteredMessages.length === 0"
                    class="mt-10 text-center">
                    <!-- <IconInbox class="mx-auto h-12 w-12 text-gray-400" /> -->
                    <h3 class="mt-2font-medium text-gray-900 text-2xl">Немає повідомлень</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        {{
                            filters.search || filters.status
                                ? "Повідомлень за вашим запитом не знайдено"
                                : "Поки що не було відправлено жодного повідомлення"
                        }}
                    </p>
                    <NuxtLink to="/admin/create-post">
						<Button class="mt-6">Створити повідомлення</Button>
					</NuxtLink>
                </div>

                <!-- Messages Grid -->
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <MessageHistoryItem
                            v-for="message in paginatedMessages"
                            :key="message.id"
                            :message="message" />
                    </div>

                    <!-- Pagination -->
                    <!-- <div class="mt-6">
            <MessagesPagination
              v-model:page="currentPage"
              :total-items="filteredMessages.length"
              :items-per-page="itemsPerPage"
            />
          </div> -->
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { useGiveawayStore } from "~/store/giveawayStore";

const giveawayStore = useGiveawayStore();

const { messages } = storeToRefs(giveawayStore);

const currentPage = ref(1);
const itemsPerPage = 9;
const filters = reactive({
    status: "",
    search: ""
});

const filteredMessages = computed(() => {
    return messages.value?.filter((message) => {
        const matchesStatus = !filters.status || message.giveaway.status === filters.status;
        const matchesSearch =
            !filters.search ||
            message.giveaway.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            message.content.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesSearch;
    });
});

const paginatedMessages = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredMessages.value.slice(start, end);
});

watch([() => filters.status, () => filters.search], () => {
    currentPage.value = 1;
});

onMounted(async () => {
    await giveawayStore.fetchMessages();
});
</script>

<style scoped></style>
