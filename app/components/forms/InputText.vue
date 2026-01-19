<template>
    <div :class="wrapperClass">
        <label v-if="label" :for="id" :class="labelClass">
            {{ label }}
        </label>
        <!-- With icon -->
        <IconField v-if="showIcon && icon">
            <template v-if="iconPosition === 'left'">
                <InputIcon :class="icon" />
                <component
                    :is="InputComponent"
                    v-model="valueProxy"
                    :type="type"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    :required="required"
                    :name="name"
                    :id="id"
                    :autocomplete="autocomplete"
                    :mask="mask"
                    :slotChar="slotChar"
                    :autoClear="autoClear"
                    :class="computedInputClass"
                    @input="onInput"
                    @change="onChange"
                    @focus="onFocus"
                    @blur="onBlur"
                />
            </template>
            <template v-else>
                <component
                    :is="InputComponent"
                    v-model="valueProxy"
                    :type="type"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    :required="required"
                    :name="name"
                    :id="id"
                    :autocomplete="autocomplete"
                    :mask="mask"
                    :slotChar="slotChar"
                    :autoClear="autoClear"
                    :class="computedInputClass"
                    @input="onInput"
                    @change="onChange"
                    @focus="onFocus"
                    @blur="onBlur"
                />
                <InputIcon :class="icon" />
            </template>
        </IconField>

        <!-- With append slot (custom content after input) -->
        <div v-else-if="$slots.append" class="relative">
            <component
                :is="InputComponent"
                v-model="valueProxy"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                :name="name"
                :id="id"
                :autocomplete="autocomplete"
                :mask="mask"
                :slotChar="slotChar"
                :autoClear="autoClear"
                :class="computedInputClass"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
            />
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                <slot name="append"></slot>
            </div>
        </div>

        <!-- Without icon -->
        <component
            :is="InputComponent"
            v-else
            v-model="valueProxy"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :name="name"
            :id="id"
            :autocomplete="autocomplete"
            :mask="mask"
            :slotChar="slotChar"
            :autoClear="autoClear"
            :class="computedInputClass"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

type IconPosition = 'left' | 'right';

const props = withDefaults(defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    autocomplete?: string;
    showIcon?: boolean;
    icon?: string; // e.g. "pi pi-user"
    iconPosition?: IconPosition;
    inputClass?: string;
    wrapperClass?: string;
    label?: string;
    labelClass?: string;
    mask?: string;
    slotChar?: string;
    autoClear?: boolean;
}>(), {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    name: undefined,
    id: undefined,
    autocomplete: 'off',
    showIcon: false,
    icon: '',
    iconPosition: 'left',
    inputClass: '',
    wrapperClass: '',
    label: '',
    labelClass: 'block text-md font-medium text-gray-600 mb-2',
    mask: undefined,
    slotChar: '_',
    autoClear: true
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input', event: Event): void;
    (e: 'change', event: Event): void;
    (e: 'focus', event: FocusEvent): void;
    (e: 'blur', event: FocusEvent): void;
}>();

const valueProxy = computed({
    get: () => props.modelValue ?? '',
    set: (v: string) => emit('update:modelValue', v)
});

const computedInputClass = computed(() => {
    return `h-[60px] ${props.inputClass}`.trim();
});
const InputComponent = computed(() => props.mask ? InputMask : InputText);
function onInput(event: Event) {
    emit('input', event);
}
function onChange(event: Event) {
    emit('change', event);
}
function onFocus(event: FocusEvent) {
    emit('focus', event);
}
function onBlur(event: FocusEvent) {
    emit('blur', event);
}
</script>

<style scoped>
/* Focus color styling for inputs */
:deep(.p-inputtext:focus),
:deep(.p-inputmask:focus),
:deep(input:focus) {
    border-color: var(--it-primary-color, #081AE7) !important;
    outline: none !important;
}
</style>