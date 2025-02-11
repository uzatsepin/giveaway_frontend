<template>
    <button @click="toggleSidebar"
        class="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-lg">
        <Menu v-if="!isSidebarOpen"
            class="w-6 h-6" />
        <X v-else
            class="w-6 h-6" />
    </button>

    <Transition name="slide">
        <div v-show="isSidebarOpen"
            class="w-72 bg-white h-screen shadow-lg fixed lg:relative z-40 flex flex-col pb-16 lg:pb-0">
            <!-- Logo section -->
            <SidebarLogo />
            
            <SidebarStats />

            <SidebarNav />

            <SidebarUser />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import {
    Menu,
    X,
} from "lucide-vue-next";


const isSidebarOpen = ref(true);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
    isSidebarOpen.value = window.innerWidth >= 1024;
});

onMounted(() => {
    watch(useRoute(), () => {
        if (window.innerWidth < 1024) {
            isSidebarOpen.value = false;
        }
    });
});
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
</style>
