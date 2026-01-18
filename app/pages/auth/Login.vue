<template>
  <div class="flex h-screen bg-linear-to-b from-purple-100 to-blue-50">

    <div id="col-one" class="w-1/2 bg-linear-to-b from-[#081AE7] to-[#1925E2] flex flex-col items-center justify-center gap-15 p-12 text-white overflow-hidden relative">
      <div class="text-center relative z-1">
        <img src="/images/logo-it-white.svg" alt="Logo" class="h-42 mx-auto mb-4" />
      </div>

      <Carousel :value="items" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions">
        <template #item="slotProps">
            <p class="text-center text-lg font-light leading-8 max-w-sm m-auto w-full">
              {{ slotProps.data.text }}
            </p>
        </template>
    </Carousel>

      <div class="flex flex-col items-center">
        <p class="text-md font-light italic mb-4">Acompanhe nossas redes sociais</p>
        <div class="flex gap-4">
          <a href="#" class="p-2 rounded-full bg-[#424EFF] hover:bg-opacity-10">
            <i class="pi pi-instagram"></i>
          </a>
          <a href="#" class="p-2 rounded-full bg-[#424EFF] hover:bg-opacity-10">
            <i class="pi pi-facebook"></i>
          </a>
        </div>
      </div>

      <!-- circle -->
      <div id="circle" class="absolute -bottom-40 -left-[10%] z-2 w-[470px] h-[470px] rounded-full bg-amber-600"></div>
    </div>

    <!-- Lado Direito - Formulário de Login -->
    <div class="w-1/2 flex flex-col items-center justify-center p-12">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-bold text-blue-600 mb-2">Faça seu Login</h1>
        <p class="text-gray-400 text-sm mb-8">Acesse sua conta para gerenciar seus veículos e etiquetas.</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-600 mb-2">E-mail</label>
            <input
              type="email"
              v-model="email"
              id="email"
              placeholder="Digite seu e-mail de login"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-600 mb-2">Senha</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                id="password"
                placeholder="••••••••••••••••"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
            <div class="text-right mt-2">
              <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Esqueceu sua senha?</a>
            </div>
          </div>

          <!-- Botão Entrar -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mt-8"
          >
            Entrar
          </button>
        </form>

        <!-- Cadastro -->
        <p class="text-center text-gray-600 text-sm mt-6">
          Não tem uma conta? <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Cadastre-se</a>
        </p>
      </div>

      <!-- Rodapé -->
      <div class="absolute bottom-6 text-center text-gray-400 text-xs">
        <a href="#" class="hover:text-gray-600">Política de Privacidade</a>
        <span class="mx-2">|</span>
        <a href="#" class="hover:text-gray-600">Termos LGPD</a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Carousel from 'primevue/carousel';  
  import { ref } from 'vue';

  const email = ref('');
  const password = ref('');
  const checked = ref(false);
  const showPassword = ref(false);

  const handleLogin = () => {
    console.log('Logging in with', { email: email.value, password: password.value });
  };

  // Carousel data and options
  const items = [
    { text: 'Este projeto inovador tem como objetivo transformar a mobilidade urbana no Brasil por meio de etiquetas de identificação por cores.' },
    { text: 'As etiquetas facilitam a identificação visual dos veículos, promovendo maior segurança e eficiência no trânsito.' },
    { text: 'Com a Identifica Trânsito, esperamos contribuir para um sistema de transporte mais organizado e seguro para todos.' }
  ];

  const responsiveOptions = [];
</script>

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
