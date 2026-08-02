<script setup lang="ts">
const props = defineProps<{
    dateFrom: string;
    dateTo: string;
    loading?: boolean;
}>();

const emit = defineEmits<{
    'update:dateFrom': [value: string];
    'update:dateTo': [value: string];
    apply: [];
}>();

const selectedRange = ref<Date[] | null>(null);
const popoverRef = ref<{ toggle: (event: Event) => void; hide: () => void } | null>(null);
const popoverWidth = ref<string | undefined>();

const fromInputDate = (value: string) => {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    return year && month && day ? new Date(year, month - 1, day) : null;
};

const toInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const hasCompleteRange = computed(() => Boolean(selectedRange.value?.[0] && selectedRange.value?.[1]));

const open = (event: Event) => {
    const start = fromInputDate(props.dateFrom);
    const end = fromInputDate(props.dateTo);
    selectedRange.value = start && end ? [start, end] : null;

    const trigger = event.currentTarget as HTMLElement | null;
    popoverWidth.value = window.matchMedia('(max-width: 639px)').matches && trigger
        ? `${Math.round(trigger.getBoundingClientRect().width)}px`
        : undefined;
    popoverRef.value?.toggle(event);
};

const clear = () => {
    selectedRange.value = null;
};

const apply = () => {
    if (!hasCompleteRange.value || !selectedRange.value) return;

    emit('update:dateFrom', toInputDate(selectedRange.value[0]));
    emit('update:dateTo', toInputDate(selectedRange.value[1]));
    emit('apply');
    popoverRef.value?.hide();
};

defineExpose({ open });
</script>

<template>
    <Popover ref="popoverRef" class="management-filter-popover" :style="popoverWidth ? { width: popoverWidth } : undefined">
        <DatePicker
            v-model="selectedRange"
            selectionMode="range"
            inline
            :manualInput="false"
            :showOtherMonths="false"
            class="management-calendar"
        />

        <div class="management-dialog-actions management-calendar-actions">
            <button type="button" class="management-button-secondary" @click="clear">Limpar</button>
            <button type="button" class="management-button-primary" :disabled="!hasCompleteRange || loading" @click="apply">
                Aplicar
            </button>
        </div>
    </Popover>
</template>
