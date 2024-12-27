<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden" v-if="status === 'success'">
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-medium text-gray-900">Учасники розіграшу</h2>
                <div class="flex items-center space-x-4">
                    <Input
                        v-model="globalFilter"
                        placeholder="Пошук..."
                        class="max-w-sm" />
                </div>
            </div>

            <div>
                <div class="flex justify-end mb-4">
                    <Button
                        class="mb-4"
                        @click="exportToExcel"
                        :disabled="participants.length < 1"
                        variant="secondary">
                        <Sheet class="w-5 h-5" />
                        Завантажити всіх учасників у Excel
                    </Button>
                </div>
                <div class="rounded-lg border shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    v-for="header in table.getFlatHeaders()"
                                    :key="header.id"
                                    :class="[
                                        'px-6 py-4 text-left font-medium text-gray-700 border-b',
                                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                    ]"
                                    @click="header.column.getCanSort() && header.column.toggleSorting()">
                                    <div class="flex items-center gap-2">
                                        {{ header.column.columnDef.header }}
                                        <template v-if="header.column.getCanSort()">
                                            <ArrowUpIcon
                                                v-if="header.column.getIsSorted() === 'asc'"
                                                class="h-4 w-4" />
                                            <ArrowDownIcon
                                                v-else-if="header.column.getIsSorted() === 'desc'"
                                                class="h-4 w-4" />
                                            <ArrowUpDown
                                                v-else
                                                class="h-4 w-4 opacity-50" />
                                        </template>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="row in table.getRowModel().rows"
                                :key="row.id">
                                <TableCell
                                    v-for="cell in row.getVisibleCells()"
                                    :key="cell.id"
                                    class="px-6 py-4">
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div class="flex items-center justify-between py-4">
                    <span class="text-sm text-gray-700">
                        Сторінка {{ table.getState().pagination.pageIndex + 1 }} з
                        {{ table.getPageCount() }}
                    </span>
                    <div class="space-x-2">
                        <button
                            class="rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            :disabled="!table.getCanPreviousPage()"
                            @click="table.previousPage()">
                            Попередня
                        </button>
                        <button
                            class="rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            :disabled="!table.getCanNextPage()"
                            @click="table.nextPage()">
                            Наступна
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
        <Loader size="xl" />
    </div>
</template>

<script setup lang="ts">
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, Sheet } from "lucide-vue-next";
import {
    FlexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useVueTable,
    type ColumnDef
} from "@tanstack/vue-table";
import type { IParticipant } from "~/types/participant.type";
import * as XLSX from "xlsx";
import { formatDateTable } from "~/composables/useDateUtils";
import { toast } from "../ui/toast";

const config = useRuntimeConfig();

interface AppResponse {
    data: {
        participants: IParticipant[];
    }
    success: boolean;
}
const route = useRoute();

const { data:participantsData, status } = await useFetch<AppResponse>(`${config.public.apiBaseUrl}/participant/${route.params.id}`, {
    lazy: true,
    headers: {
        Authorization: `Bearer ${useCookie("token").value}`
    }
});

const participants = computed(() => participantsData.value?.data?.participants || []);


const globalFilter = ref("");

const columns: ColumnDef<IParticipant>[] = [
    {
        accessorKey: "firstName",
        header: "Імʼя",
        enableSorting: true
    },
    {
        accessorKey: "lastName",
        header: "Прізвище",
        enableSorting: true
    },
    {
        accessorKey: "username",
        header: "username",
        enableSorting: true
    },
    {
        accessorKey: "telegramId",
        header: "ID телеграму",
        enableSorting: true
    },
    {
        accessorKey: "createdAt",
        header: "Дата прийняття участі",
        enableSorting: true,
        cell: ({ row }) => formatDateTable(row.original.createdAt)
    }
];

const table = useVueTable({
    get data() {
        return participants?.value;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get globalFilter() {
            return globalFilter.value;
        }
    },
    onGlobalFilterChange: setGlobalFilter
});

function setGlobalFilter(value: string) {
    globalFilter.value = value;
}

const exportToExcel = () => {
    if (!participants?.value) return;

    const data = participants.value.map((participant) => ({
        "Імʼя": participant.firstName,
        "username": participant.username,
        "ID телеграму": participant.telegramId,
        "Дата прийняття участі": formatDateTable(participant.createdAt),
        "ID учасника": participant.id
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Учасники");

    const fileName = `participants_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
};
</script>
