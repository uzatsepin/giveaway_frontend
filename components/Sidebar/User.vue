<template>
    <div class="p-4 border-t shrink-0">
        <div class="flex items-center gap-4">
            <span class="bg-slate-100 rounded-full w-[48px] h-[48px] flex items-center justify-center text-xl font-medium text-slate-700">
                {{ userInitials }}
            </span>
            <div class="flex flex-col">
                <span class="text-sm font-medium text-slate-700">{{ userData?.username }}</span>
                <button
                    @click="handleLogout"
                    class="text-sm text-red-500 hover:text-red-600 text-left hover:text-underline">
                    Вийти
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/store/authStore";
const authStore = useAuthStore();
const { userData } = storeToRefs(authStore);

const handleLogout = () => {
    authStore.clearUserData();
    navigateTo("/");
};
const userInitials = computed(() => {
    return userData.value?.username.charAt(0).toUpperCase() || "";
});
</script>

<style></style>
