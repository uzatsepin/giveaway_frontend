<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> {{ title }} </CardTitle>
			<component :is="titleIcon" class="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div class="text-2xl font-bold">{{ post }}</div>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { Eye, Share, Heart } from 'lucide-vue-next'
const props = defineProps({
    post: {
        type: Number,
        required: true
    },
	title: {
		type: String,
		required: true
	}
});

const titleIcon = computed(() => {
    switch (props.title) {
        case 'Переглядів':
            return Eye
        case 'Пересилань':
            return Share
        case 'Реакцій':
            return Heart
        default:
            return Eye
    }
})
</script>

<style></style>
