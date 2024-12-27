<template>
    <div class="min-h-screen bg-gray-100">
        <div class="flex">
            <!-- Mobile Toggle -->
            <button 
                @click="toggleSidebar"
                class="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-lg">
                <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
                <X v-else class="w-6 h-6" />
            </button>

            <!-- Sidebar -->
            <Transition name="slide">
                <div 
                    v-show="isSidebarOpen" 
                    class="w-72 bg-white h-screen shadow-lg fixed lg:relative z-40">
                    <div class="flex flex-col h-full">
                        <!-- Logo -->
                        <h2 class="font-bold text-xl my-8 text-center text-slate-700 flex items-center gap-2 justify-center">
                            <img src="/icons/telegram.svg" class="w-8 h-8" />
                            Wo Giveaway
                        </h2>

                        <!-- Navigation -->
                        <nav class="mt-12 flex flex-col gap-4 px-2">
                            <NuxtLink
                                v-for="link in menu"
                                :key="link.title"
                                :to="link.link"
                                class="group px-4 py-4 text-base font-medium rounded-md flex items-center gap-2 hover:bg-[#ece5ff] hover:text-[#6734ff] transition-all duration-300">
                                <component :is="link.icon" class="w-6 h-6" />
                                {{ link.title }}
                            </NuxtLink>
                        </nav>

                        <!-- User Profile -->
                        <div class="mt-auto">
                            <div class="flex items-center gap-2 mb-8 px-4">
                                <div class="flex items-center gap-4">
                                    <span class="bg-slate-100 rounded-full w-[48px] h-[48px] flex items-center justify-center text-xl font-medium text-slate-700">
                                        {{ userInitials }}
                                    </span>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-slate-700">{{ userData?.username }}</span>
                                        <button 
                                            @click="handleLogout"
                                            class="text-sm text-red-500 hover:text-red-600 text-left">
                                            Вийти
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- Main Content -->
            <div class="flex-1 p-4 lg:p-8 lg:pl-10 bg-gray-100">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, X, LayoutGrid, SquarePen, MessagesSquare } from 'lucide-vue-next'
import { useAuthStore } from '~/store/authStore'

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)
const isSidebarOpen = ref(true)

const menu = [
    {
        title: 'Дашборд',
        link: '/admin/dashboard',
        icon: LayoutGrid
    },
    {
        title: 'Створити пост',
        link: '/admin/create-post',
        icon: SquarePen
    },
    {
        title: 'Повідомлення',
        link: '/admin/posts',
        icon: MessagesSquare
    }
]

const userInitials = computed(() => {
    return userData.value?.username.charAt(0).toUpperCase() || ''
})

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
    authStore.clearUserData()
    navigateTo('/')
}

onMounted(() => {
  isSidebarOpen.value = window.innerWidth >= 1024
})
onMounted(() => {
  watch(useRoute(), () => {
    if (window.innerWidth < 1024) {
      isSidebarOpen.value = false
    }
  })
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

.router-link-exact-active {
    @apply bg-[#ece5ff] text-[#6734ff];
}
</style>