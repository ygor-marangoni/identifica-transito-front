<script lang="ts" setup>
import { computed } from 'vue';

type ButtonLinkVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonLinkSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  to: string;
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  disabled?: boolean;
  external?: boolean;
  fullWidth?: boolean;
  buttonClass?: string;
}>(), {
  variant: 'primary',
  size: 'lg',
  disabled: false,
  external: false,
  fullWidth: false,
  buttonClass: ''
});

const computedClass = computed(() => {
  const classes = [
    'rounded-lg font-semibold transition duration-200 inline-flex items-center justify-center gap-2',
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
    classes.push('h-[40px] px-4 py-2 text-sm');
  } else if (props.size === 'md') {
    classes.push('h-[50px] px-6 py-3 text-base');
  } else if (props.size === 'lg') {
    classes.push('h-[60px] px-8 py-4 text-lg');
  }

  // Width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Disabled state
  if (props.disabled) {
    classes.push('cursor-not-allowed opacity-60 pointer-events-none');
  }

  return classes.filter(Boolean).join(' ');
});
</script>

<template>
  <NuxtLink
    v-if="!external"
    :to="to"
    :class="computedClass"
  >
    <slot></slot>
  </NuxtLink>

  <a
    v-else
    :href="to"
    :class="computedClass"
  >
    <slot></slot>
  </a>
</template>

<style lang="scss" scoped>
/* Estilos adicionais se necessário */
</style>
