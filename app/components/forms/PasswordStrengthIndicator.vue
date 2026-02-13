<script setup>
import { computed } from 'vue';

const props = defineProps({
  password: {
    type: String,
    default: ''
  }
});

const passwordLength = computed(() => (props.password || '').length);
const passwordStrengthPercent = computed(() => Math.min((passwordLength.value / 8) * 100, 100));
const passwordStrengthClass = computed(() => {
  if (passwordLength.value >= 8) return 'bg-green-500';
  if (passwordLength.value >= 6) return 'bg-yellow-500';
  return 'bg-red-500';
});
</script>

<template>
  <div class="mt-2">
    <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        class="h-full transition-all duration-200"
        :class="passwordStrengthClass"
        :style="{ width: `${passwordStrengthPercent}%` }"
      ></div>
    </div>
    <p class="mt-1 text-xs" :class="passwordLength >= 8 ? 'text-green-600' : 'text-gray-500'">
      {{ passwordLength >= 8 ? 'Senha com 8 ou mais caracteres.' : 'Digite ao menos 8 caracteres.' }}
    </p>
  </div>
</template>
