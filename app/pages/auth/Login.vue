<script setup>
  import { computed, ref } from 'vue';
  import { mockDemoAccounts } from '~/mocks/api';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import InputPassword from '~/components/forms/InputPassword.vue';
  import Button from '~/components/forms/Button.vue';
  import { useToast } from 'primevue/usetoast';
  import { getDashboardByType, getUserType } from '~/utils/authRedirect';

  const toast = useToast();

  // Configurar título da página
  useHead({
    title: 'Login - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Faça login para gerenciar seus veículos e etiquetas.' }
    ]
  });

  definePageMeta({
    middleware: ['logged']
  });

  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  const config = useRuntimeConfig();
  const isMockMode = computed(() => config.public.useMocks);

  const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
      const { $api } = useNuxtApp();
      const response = await $api('/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value
        }
      });

      const token = response?.token || response?.data?.token || response?.access_token;
      const user = response?.user || response?.data?.user || response?.data || null;

      if (!token) {
        throw new Error('Token ausente na resposta.');
      }

      const auth = useAuth();
      auth.setSession(token, user);

      const userType = getUserType(user);
      await navigateTo(getDashboardByType(userType));
    } catch (error) {
      const apiMessage = error?.data?.message || error?.data?.error;
      errorMessage.value = apiMessage || error?.message || 'Nao foi possivel fazer login. Tente novamente.';
      toast.add({ severity: 'error', summary: 'Erro de Login', detail: errorMessage.value, life: 5000 });
    } finally {
      loading.value = false;
    }
  };

  const loginWithDemoAccount = async (account) => {
    if (loading.value) return;
    email.value = account.email;
    password.value = account.password;
    await handleLogin();
  };
</script>


<template>
  <LayoutAuth>
    <h1 class="font-bold text-center lg:text-left text-it-primary mb-2">Fazer Login</h1>
    <p class="text-it-gray text-md text-center lg:text-left mb-8">Acessar sua conta para gerenciar seus veículos e etiquetas.</p>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p> -->
      <!-- Email -->
      <InputText
        v-model="email"
        type="email"
        id="email"
        label="E-mail"
        labelClass="block text-md font-bold text-gray-600 mb-2"
        placeholder="Digite seu e-mail de login"
        required
        showIcon
        icon="pi pi-envelope"
        inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
      />

      <!-- Senha -->
      <div>
        <InputPassword
          v-model="password"
          id="password"
          label="Senha"
          showIcon
          icon="pi pi-lock"
          placeholder="••••••••••••••••"
          required
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />
        <div class="text-right mt-2">
          <NuxtLink to="/auth/forgot-password" class="text-[12.5px] text-blue-600 hover:text-blue-700 font-medium">
            Esqueceu sua senha?
          </NuxtLink>
        </div>
      </div>

      <!-- Botão Entrar -->
      <Button type="submit" fullWidth size="md" buttonClass="auth-primary-button" :loading="loading">
        <span>Acessar a Plataforma</span>
        <i class="pi pi-arrow-right text-base" aria-hidden="true"></i>
      </Button>
    </form>

    <section v-if="isMockMode" class="demo-access" aria-label="Acessos de demonstração">
      <p class="demo-access__eyebrow">Acessos de demonstração</p>
      <p class="demo-access__hint">Entre em cada perfil com os dados já preenchidos.</p>
      <div class="demo-access__grid">
        <button
          v-for="account in mockDemoAccounts"
          :key="account.email"
          type="button"
          class="demo-access__button"
          :disabled="loading"
          @click="loginWithDemoAccount(account)"
        >
          <span>{{ account.label }}</span>
          <small>{{ account.description }}</small>
        </button>
      </div>
    </section>

    <!-- Cadastro -->
    <p class="text-center text-gray-600 text-base mt-6">
      Não tem uma conta? 
      <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-medium">
        Cadastrar-se
      </NuxtLink>
    </p>
  </LayoutAuth>
</template>


<style scoped>
  h1 {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
  }

  :deep(.auth-primary-button) {
    height: 52px;
    transition: background-color 180ms ease;
  }

  :deep(button.auth-primary-button:hover:not(:disabled)) {
    background-color: #1739d4;
  }

  .text-it-gray {
    text-align: center;
  }

  .demo-access {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid #e8ebf3;
  }

  .demo-access__eyebrow {
    margin: 0;
    color: #17204b;
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .demo-access__hint {
    margin: .35rem 0 .85rem;
    color: #64708a;
    font-size: .8125rem;
    line-height: 1.35;
  }

  .demo-access__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .5rem;
  }

  .demo-access__button {
    min-width: 0;
    padding: .7rem .55rem;
    border: 1px solid #dce2ef;
    border-radius: .625rem;
    background: #f8faff;
    color: #111a38;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
  }

  .demo-access__button:hover:not(:disabled), .demo-access__button:focus-visible {
    border-color: #2856e9;
    background: #eef3ff;
    outline: none;
    transform: translateY(-1px);
  }

  .demo-access__button:disabled { cursor: wait; opacity: .6; }
  .demo-access__button span, .demo-access__button small { display: block; }
  .demo-access__button span { font-size: .75rem; font-weight: 700; line-height: 1.2; }
  .demo-access__button small { margin-top: .25rem; color: #64708a; font-size: .6875rem; line-height: 1.25; }

  @media (max-width: 540px) {
    .demo-access__grid { grid-template-columns: 1fr; }
  }

  :deep(label .text-red-500) {
    display: none;
  }

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
