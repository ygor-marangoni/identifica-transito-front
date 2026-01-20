<script lang="ts" setup>
import { computed } from 'vue';
import Select from 'primevue/select';

interface SelectOption {
    label: string;
    value: any;
    icon?: string;
}

const props = withDefaults(defineProps<{
    modelValue: any;
    options: SelectOption[] | string[];
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    label?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    showIcon?: boolean;
    icon?: string;
    filter?: boolean;
    filterPlaceholder?: string;
    showClear?: boolean;
    wrapperClass?: string;
    labelClass?: string;
    selectClass?: string;
}>(), {
    modelValue: null,
    placeholder: '',
    label: '',
    id: '',
    required: false,
    disabled: false,
    showIcon: false,
    icon: '',
    filter: false,
    filterPlaceholder: 'Buscar...',
    showClear: false,
    wrapperClass: '',
    labelClass: 'block text-sm font-semibold text-gray-900 mb-2',
    selectClass: ''
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any): void;
}>();

const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const computedSelectClass = computed(() => {
    const classes = [
        'w-full h-[60px] px-4 py-3 border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
        'text-gray-700 font-medium bg-white',
        'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
        props.selectClass
    ];
    return classes.filter(Boolean).join(' ');
});

const handleChange = (event: any) => {
    emit('change', event);
};

// Normalizar opções para sempre ter formato de objeto
const normalizedOptions = computed(() => {
    return props.options.map(option => {
        if (typeof option === 'string') {
            return { label: option, value: option };
        }
        return option as SelectOption;
    });
});
</script>

<template>
    <div :class="wrapperClass">
        <!-- Label -->
        <label v-if="label" :for="id" :class="labelClass">
            {{ label }}
        </label>

        <!-- Select com Icon -->
        <div v-if="showIcon && icon" class="relative">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-it-primary pointer-events-none z-10">
                <i :class="icon"></i>
            </div>
            <Select
                v-model="modelValueProxy"
                :options="normalizedOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="placeholder"
                :disabled="disabled"
                :filter="filter"
                :filterPlaceholder="filterPlaceholder"
                :showClear="showClear"
                :class="computedSelectClass"
                :inputClass="'!pl-10'"
                @change="handleChange"
            >
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <i v-if="slotProps.option.icon" :class="slotProps.option.icon" class="text-it-primary"></i>
                        <span>{{ slotProps.option.label }}</span>
                    </div>
                </template>
            </Select>
        </div>

        <!-- Select sem Icon -->
        <Select
            v-else
            v-model="modelValueProxy"
            :options="normalizedOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="placeholder"
            :disabled="disabled"
            :filter="filter"
            :filterPlaceholder="filterPlaceholder"
            :showClear="showClear"
            :class="computedSelectClass"
            @change="handleChange"
        >
            <template #option="slotProps">
                <div class="flex items-center gap-2">
                    <i v-if="slotProps.option.icon" :class="slotProps.option.icon" class="text-it-primary"></i>
                    <span>{{ slotProps.option.label }}</span>
                </div>
            </template>
        </Select>
    </div>
</template>

<style lang="scss" scoped>
/* Estilos adicionais se necessário */
:deep(.p-select) {
    height: 60px !important;
    
    .p-select-label {
        height: 100%;
        display: flex;
        align-items: center;
    }
}

:deep(.p-select-filter-container) {
    padding: 0.5rem;
}

:deep(.p-select-filter-container input) {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    
    &:focus {
        outline: none;
        ring: 2px solid #2563eb;
    }
}
</style>
