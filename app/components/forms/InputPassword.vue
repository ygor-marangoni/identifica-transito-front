<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="id" :class="`block mb-2 text-sm font-semibold text-[#172b4d] ${labelClass}`">
      {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <InputText
      v-model="valueProxy"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :showIcon="showIcon"
      :icon="icon"
      :iconPosition="iconPosition"
      :inputClass="inputClass"
      :minlength="8"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template #append>
        <button
          type="button"
          @click="toggleVisibility"
          class="text-gray-400 hover:text-gray-600 focus:outline-none relative top-0.5"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
        >
          <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
          </svg>
        </button>
      </template>
    </InputText>
    <!-- slot -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InputText from '~/components/forms/InputText.vue';
import { usePasswordToggle } from '~/composables/usePasswordToggle';

const props = withDefaults(defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  autocomplete?: string;
  inputClass?: string;
  showIcon?: boolean;
  icon?: string | object | Function;
  iconPosition?: 'left' | 'right';
  wrapperClass?: string;
  label?: string;
  labelClass?: string;
  minlength?: number;
}>(), {
  modelValue: '',
  placeholder: '••••••••••••••••',
  disabled: false,
  readonly: false,
  required: false,
  name: undefined,
  id: undefined,
  autocomplete: 'current-password',
  inputClass: '',
  showIcon: false,
  icon: '',
  iconPosition: 'left',
  wrapperClass: '',
  label: '',
  labelClass: '',
  minlength: 8
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'input', event: Event): void;
  (e: 'change', event: Event): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const { showPassword, inputType, toggleVisibility } = usePasswordToggle();

const valueProxy = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v)
});

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
/* Estilos herdados do InputText */
</style>
