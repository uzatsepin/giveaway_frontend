<template>
    <div class="min-h-screen bg-gray-100">
        <div class="flex">
            <!-- Sidebar -->
            <div class="w-72 bg-white h-screen shadow-lg fixed">
                <div class="flex flex-col h-full">
                    <h2 class="font-bold text-xl my-8 text-center text-slate-700 flex items-center gap-2 justify-center">
                        <img src="/icons/telegram.svg" class="w-8 h-8" />
                        Wo Giveaway
                    </h2>
                    <nav class="mt-12 flex flex-col gap-4 px-2">
                        <NuxtLink
                            :to="link.link"
                            class="group px-4 py-4 text-base font-medium rounded-md flex items-center gap-2 hover:bg-[#ece5ff] hover:text-[#6734ff] transition-all duration-300"
                            v-for="link in menu"
                            :key="link.title">
                            <component :is="link.icon"
                                class="w-6 h-6 hover:text-[#6734ff]" />
                            {{ link.title }}
                        </NuxtLink>
                    </nav>
                    <div class="mt-auto">
                        <div
                            class="flex items-center gap-2 mb-8 px-4">
                            <div class="flex items-center gap-4">
                                <span class="bg-slate-100 rounded-full w-[48px] h-[48px] flex items-center justify-center">
                                    <User class="w-7 h-7 text-slate-600" />
                                </span>
                                <div class="flex flex-col gap-1">
                                    <p class="text-lg text-slate-600">{{userData?.username}}</p>
                                    <p class="text-sm text-slate-500">ID: {{userData?.id}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 p-8 ml-72">
                <slot v-if="!isLoading"/>
                <div v-else class="flex items-center justify-center h-full">
                    <Loader size="xl" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {User, Home, Newspaper, MessageCircle} from 'lucide-vue-next'
import { useAuthStore } from '~/store/authStore';
const { isLoading } = useAuth();

const authStore = useAuthStore();

const { userData } = storeToRefs(authStore);


const menu = [
    {
        title: "Головна",
        link: "/admin/dashboard",
        icon: Home
    },
    {
        title: "Створити пост",
        link: "/admin/create-post",
        icon: Newspaper
    },
    {
        title: "Повідомлення",
        link: "/admin/posts",
        icon: MessageCircle
    }
];
</script>

<style scoped>
.router-link-exact-active {
    @apply bg-[#ece5ff] text-[#6734ff];
}
</style>
