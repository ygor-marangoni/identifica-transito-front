<script setup>
  import { ref } from 'vue';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import InputPassword from '~/components/forms/InputPassword.vue';
  import Button from '~/components/forms/Button.vue';

  // Configurar título da página
  useHead({
    title: 'Login - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Faça login para gerenciar seus veículos e etiquetas.' }
    ]
  });

  const email = ref('wesley@example.com');
  const password = ref('abc123456');
  const loading = ref(false);

  const handleLogin = () => {
    loading.value = true;
    console.log('Logging in with', { email: email.value, password: password.value });

    setTimeout(() => {
      loading.value = false;
    }, 2000);
  };

  
</script>


<template>
  <LayoutAuth>
    <h1 class="text-[28px]! font-bold text-center lg:text-left text-it-primary mb-2!">Faça seu Login</h1>
    <p class="text-it-gray text-md text-center lg:text-left mb-8!">Acesse sua conta para gerenciar seus veículos e etiquetas.</p>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email -->
      <InputText
        v-model="email"
        type="email"
        id="email"
        label="E-mail"
        placeholder="Digite seu e-mail de login"
        required
        inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
      />

      <!-- Senha -->
      <div>
        <InputPassword
          v-model="password"
          id="password"
          label="Senha"
          placeholder="••••••••••••••••"
          required
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />
        <div class="text-right mt-2">
          <NuxtLink to="/auth/forgot-password" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Esqueceu sua senha?
          </NuxtLink>
        </div>
      </div>

      <!-- Botão Entrar -->
      <Button type="submit" fullWidth :loading="loading">
        Entrar
      </Button>
    </form>

    <!-- Cadastro -->
    <p class="text-center text-gray-600 text-sm mt-6">
      Não tem uma conta? 
      <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-medium">
        Cadastre-se
      </NuxtLink>
    </p>
  </LayoutAuth>
</template>


<style scoped>
  #col-one {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -45vh;
      left: 50%;
      width: 760px;
      height: 760px;
      background: #D9D9D9;
      background: linear-gradient(180deg,rgba(217, 217, 217, 0.25) 0%, rgba(255, 255, 255, 0) 100%);
      z-index: 1;
      border-radius: 50%;
      transform: translateX(-50%);
    }

    &::after {
      content: '';
      position: absolute;
      top: -20vh;
      left: 50%;
      width: 294px;
      height: 294px;
      background: #1422E4;
      z-index: 2;
      border-radius: 50%;
      transform: translateX(-50%);
    }
  }

  #circle {
    background: #fff;
    background: linear-gradient(201deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0));
    opacity: .1
  }

  :deep(.p-carousel) {
    --p-carousel-indicator-background: #424EFF;
    --p-carousel-indicator-hover-background: rgba(255, 255, 255, 0.6);
    --p-carousel-indicator-active-background: #BABFFF;
  }
</style>
