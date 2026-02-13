<script setup>
  import { ref } from 'vue';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import Button from '~/components/forms/Button.vue';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();

  definePageMeta({
    middleware: ['logged']
  });
  
  // Configurar título da página
  useHead({
    title: 'Esqueceu sua senha - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Recupere o acesso à sua conta.' }
    ]
  });

  const email = ref('');
  const loading = ref(false);
  const emailSent = ref(false);
  const errorMessage = ref('');

  const handleResetPassword = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
      const { $api } = useNuxtApp();
      await $api('/forgot-password', {
        method: 'POST',
        body: {
          email: email.value
        }
      });
      emailSent.value = true;
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Email de recuperação enviado com sucesso!', life: 5000 });
    } catch (error) {
      const apiMessage = error?.data?.message || error?.data?.error;
      errorMessage.value = apiMessage || error?.message || 'Nao foi possivel enviar o email.';
      toast.add({ severity: 'error', summary: 'Erro ao recuperar senha', detail: errorMessage.value, life: 5000 });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <LayoutAuth>
    <!-- Sucesso -->
    <div v-if="emailSent" class="text-center">
      <div class="mb-6 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-[28px] font-bold text-it-primary mb-2">Email enviado!</h1>
      <p class="text-it-gray text-md mb-8 leading-6">
        Enviamos um link de recuperação para <strong>{{ email }}</strong>. <br />
        Verifique sua caixa de entrada e spam.
      </p>
      <div class="space-y-6">
        <Button fullWidth @click="emailSent = false" variant="primary">
          Enviar novamente
        </Button>
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

    <!-- Formulário -->
    <div v-else>
      <h1 class="text-[24px]! font-bold text-it-primary mb-2">Esqueceu sua senha?</h1>
      <p class="text-it-gray text-md mb-8!">
        Digite seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- Email -->
        <InputText
          v-model="email"
          type="email"
          id="email"
          label="E-mail"
          placeholder="Digite seu e-mail cadastrado"
          required
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />

        <!-- Botão Enviar -->
        <Button type="submit" fullWidth :loading="loading">
          Enviar link de recuperação
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
