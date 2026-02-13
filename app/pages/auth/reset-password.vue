<script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputPassword from '~/components/forms/InputPassword.vue';
  import PasswordStrengthIndicator from '~/components/forms/PasswordStrengthIndicator.vue';
  import Button from '~/components/forms/Button.vue';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  const route = useRoute();

  definePageMeta({
    middleware: ['logged']
  });

  // Configurar título da página
  useHead({
    title: 'Redefinir Senha - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Redefinir sua senha de acesso.' }
    ]
  });

  // Extrair token e email da URL
  const token = computed(() => route.query.token || '');
  const email = computed(() => decodeURIComponent(route.query.email || ''));

  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const invalidToken = ref(!token.value || !email.value);

  // Validações
  const passwordsMatch = computed(() => password.value === confirmPassword.value && password.value.length > 0);
  const passwordValid = computed(() => password.value.length >= 8);
  const confirmPasswordValid = computed(() => confirmPassword.value.length >= 8);
  const isFormValid = computed(() => passwordsMatch.value && passwordValid.value && confirmPasswordValid.value);

  const handleResetPassword = async () => {
    if (!isFormValid.value) {
      toast.add({
        severity: 'error',
        summary: 'Erro na validação',
        detail: 'As senhas devem ter no mínimo 8 caracteres e ser iguais.',
        life: 5000
      });
      return;
    }

    loading.value = true;

    try {
      const { $api } = useNuxtApp();
      await $api('/reset-password', {
        method: 'POST',
        body: {
          token: token.value,
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value
        }
      });

      toast.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: 'Senha redefinida com sucesso! Redirecionando para o login...', 
        life: 5000 
      });

      setTimeout(() => {
        navigateTo('/auth/login');
      }, 2000);
    } catch (error) {
      const apiMessage = error?.data?.message || error?.data?.error;
      const errorMsg = apiMessage || error?.message || 'Não foi possível redefinir a senha.';
      
      toast.add({ 
        severity: 'error', 
        summary: 'Erro ao redefinir senha', 
        detail: errorMsg, 
        life: 5000 
      });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <LayoutAuth>
    <!-- Token inválido -->
    <div v-if="invalidToken" class="text-center">
      <div class="mb-6 inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-[28px] font-bold text-it-primary mb-2">Link inválido</h1>
      <p class="text-it-gray text-md mb-8 leading-6">
        O link de recuperação de senha é inválido ou expirou.
      </p>
      <div class="space-y-4">
        <NuxtLink to="/auth/forgot-password" class="inline-block w-full">
          <Button fullWidth variant="primary">
            Solicitar novo link
          </Button>
        </NuxtLink>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/auth/login">
            Voltar para o login
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/auth/register">
            Criar nova conta
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Formulário de reset -->
    <div v-else>
      <h1 class="text-[24px]! font-bold text-it-primary mb-2">Redefinir Senha</h1>
      <p class="text-it-gray text-md mb-8!">
        Crie uma nova senha para sua conta.
      </p>

      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- Primeira Senha -->
        <div>
          <InputPassword
            v-model="password"
            id="password"
            label="Nova Senha"
            placeholder="••••••••••••••••"
            required
            minlength="8"
            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
          />
          <PasswordStrengthIndicator :password="password" />
        </div>

        <!-- Confirmação de Senha -->
        <div>
          <InputPassword
            v-model="confirmPassword"
            id="confirmPassword"
            label="Confirmar Senha"
            placeholder="••••••••••••••••"
            required
            minlength="8"
            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
          />
          <div v-if="confirmPassword" class="mt-2">
            <div class="flex items-center gap-2">
              <svg 
                v-if="passwordsMatch" 
                class="w-5 h-5 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg 
                v-else 
                class="w-5 h-5 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <p :class="passwordsMatch ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                {{ passwordsMatch ? 'As senhas são iguais' : 'As senhas não correspondem' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Botão Redefinir -->
        <Button 
          type="submit" 
          fullWidth 
          :loading="loading"
          :disabled="!isFormValid"
        >
          Redefinir Senha
        </Button>
      </form>

      <!-- Voltar ao Login -->
      <div class="text-center mt-6">
        <NuxtLink to="/auth/login" class="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voltar para o login
        </NuxtLink>
      </div>
    </div>
  </LayoutAuth>
</template>

<style scoped>
/* Estilos herdados do LayoutAuth */
</style>
