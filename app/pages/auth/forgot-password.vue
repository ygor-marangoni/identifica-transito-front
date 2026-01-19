<script setup>
  import { ref } from 'vue';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import Button from '~/components/forms/Button.vue';

  // Configurar título da página
  useHead({
    title: 'Esqueceu sua senha - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Recupere o acesso à sua conta.' }
    ]
  });

  const email = ref('wesley@example.com');
  const loading = ref(false);
  const emailSent = ref(false);

  const handleResetPassword = () => {
    loading.value = true;
    console.log('Enviando email de recuperação para:', email.value);

    // Simular envio de email
    setTimeout(() => {
      loading.value = false;
      emailSent.value = true;
    }, 2000);
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
      <p class="text-it-gray text-md mb-8">
        Enviamos um link de recuperação para <strong>{{ email }}</strong>. 
        Verifique sua caixa de entrada e spam.
      </p>
      <div class="space-y-4">
        <Button fullWidth @click="emailSent = false" variant="outline">
          Enviar novamente
        </Button>
        <NuxtLink to="/auth/login">
          <Button fullWidth variant="text">
            Voltar para o login
          </Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Formulário -->
    <div v-else>
      <h1 class="text-[28px] font-bold text-it-primary mb-2">Esqueceu sua senha?</h1>
      <p class="text-it-gray text-md mb-8!">
        Digite seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-md font-medium text-gray-600 mb-2">E-mail</label>
          <InputText
            v-model="email"
            type="email"
            id="email"
            placeholder="Digite seu e-mail cadastrado"
            required
            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
          />
        </div>

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
