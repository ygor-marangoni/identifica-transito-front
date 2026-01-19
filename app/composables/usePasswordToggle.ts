import { ref, computed } from 'vue';

export function usePasswordToggle() {
  const showPassword = ref(false);

  const inputType = computed(() => showPassword.value ? 'text' : 'password');

  const toggleVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const eyeIcon = computed(() => showPassword.value ? 'eye-slash' : 'eye');

  return {
    showPassword,
    inputType,
    toggleVisibility,
    eyeIcon
  };
}
