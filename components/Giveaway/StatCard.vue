<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 w-[48px] h-[48px]">
                <component :is="icon" class="h-6 w-6 text-indigo-600" />
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-slate-500">{{ title }}</p>
                <p class="text-2xl font-semibold text-slate-900">{{ Number(value) > 0 ? `${value}` : 'Завершений' }}</p>
                <p v-if="subtext" class="text-sm text-slate-500">{{ subtext }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


defineProps<{
    title: string
    value?: string | number
    subtext?: string
    icon: any
}>()
</script>