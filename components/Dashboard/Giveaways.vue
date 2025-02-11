<template>
    <div class="bg-white rounded-lg shadow p-6">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Зображення</TableHead>
                    <TableHead>Назва</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата початку</TableHead>
                    <TableHead>Дата закінчення</TableHead>
                    <TableHead>Учасники</TableHead>
                    <TableHead>Підписники</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="giveaway in giveaways"
                    :key="giveaway.id">
                    <TableCell>
                        <NuxtImg :src="giveaway.imageUrl"
                            :alt="giveaway.title"
                            class="w-16 h-16 rounded-lg" />
                    </TableCell>
                    <TableCell class="font-medium">{{ giveaway.title }}</TableCell>
                    <TableCell>
                        <!-- <Badge :variant="getStatusVariant(giveaway.status)"> -->
                            {{ getStatusText(giveaway.status) }}
                        <!-- </Badge> -->
                    </TableCell>
                    <TableCell>{{ formatDate(giveaway.startDate) }}</TableCell>
                    <TableCell>{{ formatDate(giveaway.endDate) }}</TableCell>
                    <TableCell>{{ giveaway.participantsCount }}</TableCell>
                    <TableCell>
                        <span class="text-muted-foreground">{{ giveaway.subsBeforeStart }}</span>
                        <ArrowRight class="inline-block w-4 h-4 mx-1" />
                        <span :class="getSubscriberGrowthClass(giveaway)">
                            {{ giveaway.subsAfterEnd }}
                            <span class="text-xs ml-1">
                                ({{ getSubscriberGrowth(giveaway) }})
                            </span>
                        </span>
                    </TableCell>
                    <TableCell>
                        <NuxtLink :to="`/admin/giveaways/${giveaway.id}`">
                            <Button size="sm">
                                <ExternalLink class="w-4 h-4 mr-1" />
                                Перейти
                        </Button>
                        </NuxtLink>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import type { IGiveaway } from '~/types/giveaway.type';
import { ExternalLink, ArrowRight } from 'lucide-vue-next';

const props = defineProps<{ giveaways: IGiveaway[] }>();

const getStatusVariant = (status: IGiveaway['status']) => {
    switch (status) {
        case 'ACTIVE':
            return 'default';
        case 'COMPLETED':
            return 'success';
        case 'CANCELLED':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const getStatusText = (status: IGiveaway['status']) => {
    switch (status) {
        case 'ACTIVE':
            return 'Активний';
        case 'COMPLETED':
            return 'Завершений';
        case 'CANCELLED':
            return 'Скасований';
        case 'DRAFT':
            return 'Чернетка';
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getSubscriberGrowth = (giveaway: IGiveaway) => {
    const growth = giveaway.subsAfterEnd - giveaway.subsBeforeStart;
    return growth > 0 ? `+${growth}` : growth;
};

const getSubscriberGrowthClass = (giveaway: IGiveaway) => {
    const growth = giveaway.subsAfterEnd - giveaway.subsBeforeStart;
    return {
        'text-green-500': growth > 0,
        'text-red-500': growth < 0,
        'text-gray-900': growth === 0
    };
};
</script>