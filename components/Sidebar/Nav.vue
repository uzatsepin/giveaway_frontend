<template>
    <nav class="flex-1 overflow-y-auto px-2 mt-8 md:mt-14">
        <div class="flex flex-col gap-2">
            <NuxtLink
                v-for="link in menu"
                :key="link.title"
                :to="link.link"
                class="group px-4 py-4 text-base font-medium rounded-md flex items-center gap-2 hover:bg-[#ece5ff] hover:text-[#6734ff] transition-all duration-300 cursor-pointer">
                <component
                    :is="link.icon"
                    class="w-6 h-6" />
                {{ link.title }}
                <span
                    v-if="activeGiveaways && activeGiveaways.length > 0 && link.title === 'Розіграші'"
                    class="ml-2 flex items-center justify-center w-6 h-6 bg-[#6734ff] rounded-full text-white"
                    >{{ activeGiveaways.length }}</span
                >
            </NuxtLink>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import {
    SquarePen,
    MessagesSquare,
    Gift,
    ChartSpline,
} from "lucide-vue-next";
import { useGiveawayStore } from "~/store/giveawayStore";

const giveawayStore = useGiveawayStore();

const menu = [
    {
        title: "Дашборд",
        link: "/admin/dashboard",
        icon: ChartSpline,
    },
    {
        title: "Розіграші",
        link: "/admin/giveaways",
        icon: Gift,
    },
    {
        title: "Створити пост",
        link: "/admin/create-post",
        icon: SquarePen,
    },
    {
        title: "Повідомлення",
        link: "/admin/posts",
        icon: MessagesSquare,
    },
];

const activeGiveaways = computed(() => {
    return giveawayStore.giveaways.filter((giveaway) => giveaway.status === "ACTIVE");
});

await giveawayStore.fetchGiveaways();


</script>

<style>
.router-link-exact-active {
    @apply bg-[#ece5ff] text-[#6734ff];
}
</style>
