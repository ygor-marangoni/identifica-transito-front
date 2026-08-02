<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    currentPage: number;
    lastPage: number;
    loading?: boolean;
    maxVisible?: number;
    showSummary?: boolean;
}>(), {
    loading: false,
    maxVisible: 5,
    showSummary: true
});

const emit = defineEmits<{
    (e: 'page-change', page: number): void;
}>();

const canGoToPreviousPage = computed(() => props.currentPage > 1);
const canGoToNextPage = computed(() => props.currentPage < props.lastPage);

const visiblePages = computed(() => {
    const totalPages = props.lastPage;
    const currentPage = props.currentPage;
    const maxVisible = props.maxVisible;

    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const goToPage = (page: number) => {
    if (props.loading || page < 1 || page > props.lastPage || page === props.currentPage) return;
    emit('page-change', page);
};

const goToPreviousPage = () => {
    if (!canGoToPreviousPage.value) return;
    goToPage(props.currentPage - 1);
};

const goToNextPage = () => {
    if (!canGoToNextPage.value) return;
    goToPage(props.currentPage + 1);
};
</script>

<template>
    <div v-if="lastPage > 1" class="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p v-if="showSummary" class="text-sm font-semibold" style="color: #334155 !important; opacity: 0.8 !important;">
            Página {{ currentPage }} de {{ lastPage }}
        </p>

        <div class="flex items-center gap-2">
            <button
                type="button"
                class="w-9 h-9 rounded-lg !border-[#94a3b8] dark:border-surface-700 !text-[#334155] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-surface-700 disabled:opacity-100 disabled:!text-[#64748b] disabled:cursor-not-allowed"
                :disabled="!canGoToPreviousPage || loading"
                @click="goToPreviousPage"
            >
                <i class="pi pi-chevron-left"></i>
            </button>

            <button
                v-for="page in visiblePages"
                :key="page"
                type="button"
                :class="[
                    'w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
                    page === currentPage
                        ? 'bg-it-primary border-it-primary text-white'
                        : '!border-[#94a3b8] dark:border-surface-700 !text-[#334155] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-surface-700'
                ]"
                :disabled="loading"
                @click="goToPage(page)"
            >
                {{ page }}
            </button>

            <button
                type="button"
                class="w-9 h-9 rounded-lg !border-[#94a3b8] dark:border-surface-700 !text-[#334155] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-surface-700 disabled:opacity-100 disabled:!text-[#64748b] disabled:cursor-not-allowed"
                :disabled="!canGoToNextPage || loading"
                @click="goToNextPage"
            >
                <i class="pi pi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>
