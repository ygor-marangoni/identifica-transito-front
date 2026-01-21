<script lang="ts" setup>
import { computed } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  buttonClass?: string;
  icon?: string;
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'lg',
  disabled: false,
  loading: false,
  fullWidth: false,
  buttonClass: '',
  icon: '',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const computedClass = computed(() => {
  const classes = [
    'rounded-lg font-semibold transition duration-200 inline-flex items-center justify-center gap-2 h-[60px]',
    props.buttonClass
  ];

  // Variant styles
  if (props.variant === 'primary') {
    classes.push('bg-it-primary text-white hover:bg-it-secondary disabled:bg-gray-300');
  } else if (props.variant === 'secondary') {
    classes.push('bg-it-secondary text-white hover:bg-it-primary disabled:bg-gray-300');
  } else if (props.variant === 'outline') {
    classes.push('bg-transparent border-2 border-it-primary text-it-primary hover:bg-it-primary hover:text-white disabled:border-gray-300 disabled:text-gray-300');
  } else if (props.variant === 'text') {
    classes.push('bg-transparent text-it-primary hover:bg-gray-100 disabled:text-gray-300');
  } else if (props.variant === 'danger') {
    classes.push('bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300');
  }

  // Size styles
  if (props.size === 'sm') {
    classes.push('h-[40px] px-4 py-2 text-md');
  } else if (props.size === 'md') {
    classes.push('h-[50px] px-6 py-3 text-base');
  } else if (props.size === 'lg') {
    classes.push('h-[60px] px-8 py-4 text-lg');
  }

  // Width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Disabled/Loading state
  if (props.disabled || props.loading) {
    classes.push('cursor-not-allowed opacity-60');
  }

  return classes.filter(Boolean).join(' ');
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="computedClass"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <svg 
      v-if="loading" 
      class="animate-spin h-5 w-5" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <i v-else-if="icon" :class="icon"></i>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
/* Estilos adicionais se necessário */
</style>
