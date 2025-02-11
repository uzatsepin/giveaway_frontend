<template>
    <div class="min-h-screen bg-gray-100">
        <div class="flex h-screen overflow-hidden">
            <Sidebar />
            <main class="flex-1 overflow-y-auto md:p-8 p-6 pb-48 lg:pb-48">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>