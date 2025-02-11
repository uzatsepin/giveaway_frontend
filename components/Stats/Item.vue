<template>
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-2">
                <MessageSquare class="w-5 h-5 text-blue-500" />
                <a
                    :href="post.link"
                    target="_blank"
                    class="text-blue-500 hover:text-blue-600 font-medium">
                    Telegram Post #{{ post.id }}
                </a>
            </div>
            <div class="flex items-center space-x-4 text-gray-600">
                <div class="flex items-center space-x-1">
                    <Eye class="w-4 h-4" />
                    <span class="text-sm">{{ post.views }}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <Share2 class="w-4 h-4" />
                    <span class="text-sm">{{ post.forwards }}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <Heart class="w-4 h-4" />
                    <span class="text-sm">{{ post.reactions }}</span>
                </div>
            </div>
        </div>
        <p class="text-gray-700 whitespace-pre-line line-clamp-6">{{ post.text }}</p>
    </div>
</template>

<script setup>
import { MessageSquare, Eye, Share2, Heart } from "lucide-vue-next";

defineProps({
    post: {
        type: Object,
        required: true
    }
});
</script>
