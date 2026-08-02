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
    icon?: string | object | Function;
    iconPosition?: IconPosition;
    inputClass?: string;
    wrapperClass?: string;
    label?: string;
    labelClass?: string;
    mask?: string;
    slotChar?: string;
    autoClear?: boolean;
    minlength?: number;
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
    labelClass: 'block mb-2 text-sm font-semibold text-[#172b4d]',
    mask: undefined,
    slotChar: '_',
    autoClear: true,
    minlength: undefined
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
    return `h-14 sm:h-12 ${props.inputClass}`.trim();
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

<template>
    <div :class="wrapperClass">
        <label v-if="label" :for="id" :class="labelClass">
            {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
        </label>
        <!-- With icon -->
        <IconField v-if="showIcon && icon">
            <template v-if="iconPosition === 'left'">
                <InputIcon v-if="typeof icon === 'string'" :class="icon" />
                <component v-else :is="icon" :size="18" :stroke-width="1.8" class="p-inputicon text-slate-400" aria-hidden="true" />
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
                    :minlength="minlength"
                    @input="onInput"
                    @change="onChange"
                    @focus="onFocus"
                    @blur="onBlur"
                />
                <div v-if="$slots.append" class="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <slot name="append"></slot>
                </div>
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
                <InputIcon v-if="typeof icon === 'string'" :class="icon" />
                <component v-else :is="icon" :size="18" :stroke-width="1.8" class="p-inputicon text-slate-400" aria-hidden="true" />
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
                :minlength="minlength"
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
            :minlength="minlength"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<style scoped>
/* Focus color styling for inputs */
:deep(.p-inputtext.p-component:focus),
:deep(.p-inputmask.p-component:focus),
:deep(input.p-component:focus) {
    border-color: #64748b;
    box-shadow: 0 0 0 1px #64748b;
    outline: none;
}

:deep(.p-inputtext.p-component),
:deep(.p-inputmask.p-component) {
    height: 56px;
}

@media (min-width: 640px) {
    :deep(.p-inputtext.p-component),
    :deep(.p-inputmask.p-component) {
        height: 48px;
    }
}
</style>
