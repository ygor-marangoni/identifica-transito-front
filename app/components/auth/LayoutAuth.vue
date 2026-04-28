<script setup lang="ts">
  import Carousel from 'primevue/carousel';  
  
  const config = useRuntimeConfig();

  const props = withDefaults(defineProps<{
    hiddenLinksFooter?: boolean;
  }>(), {
    hiddenLinksFooter: false
  });
  
  // Carousel data and options
  const items = [
    { text: 'Este projeto inovador tem como objetivo transformar a mobilidade urbana no Brasil por meio de etiquetas de identificação por cores.' },
    { text: 'As etiquetas facilitam a identificação visual dos veículos, promovendo maior segurança e eficiência no trânsito.' },
    { text: 'Com a Identifica Trânsito, esperamos contribuir para um sistema de transporte mais organizado e seguro para todos. Faça parte dessa transformação!' }
  ];
</script>


<template>
  <div class="flex md:h-screen min-h-screen md:overflow-hidden bg-[#1925e2] lg:bg-[#F0F1FF]! p-3 lg:p-0 relative">

    <!-- Background video (left side) -->
    <video
      class="hidden lg:block absolute top-0 left-0 w-1/2 h-full object-cover opacity-20 z-0 pointer-events-none"
      src="/files/video-login.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

    <div id="col-one" class="hidden lg:flex w-1/2 bg-linear-to-b from-[#081AE7]/85 to-[#1925E2]/85 flex-col items-center justify-center gap-15 p-12 text-white overflow-hidden relative z-10">
      <div class="text-center relative z-1">
        <img src="/images/logo-it-white.svg" alt="Logo" class="h-52 mx-auto mb-4" />
      </div>

      <Carousel :value="items" :numVisible="1" :numScroll="1" circular :autoplay-interval="10000"  class="w-full max-w-lg mb-8">
        <template #item="slotProps">
            <p class="text-center text-lg font-light leading-8 max-w-md m-auto w-full px-2">
              {{ slotProps.data.text }}
            </p>
        </template>
      </Carousel>

      <a
        :href="config.app.baseURL"
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        Conheça o Projeto
      </a>

      <div id="socials" class="flex flex-col items-center relative">
        <!-- bg-[#1925E2] -->
        <p class="text-md font-light italic mb-4 px-4">Acompanhe nossas redes sociais</p>
        <div class="flex gap-4">
          <a
            href="https://www.instagram.com/identificatransito/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Acessar Instagram do Identifica Trânsito"
            class="p-2 rounded-full bg-[#424EFF] hover:bg-opacity-10"
          >
            <i class="pi pi-instagram"></i>
          </a>
          <a
            href="https://wa.me/5511984971689"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp do Identifica Trânsito"
            class="p-2 rounded-full bg-[#424EFF] hover:bg-opacity-10"
          >
            <i class="pi pi-whatsapp"></i>
          </a>
        </div>
      </div>

      <!-- circle -->
      <div id="circle" class="absolute -bottom-40 -left-[10%] z-2 w-117.5 h-117.5 rounded-full bg-amber-600"></div>
    </div>

    <!-- Lado Direito - Formulário de Login -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-0 min-h-screen md:min-h-full md:overflow-hidden">
      <div class="w-full md:w-[85%] max-w-171.25 bg-white p-8 lg:p-12 rounded-[20px] relative z-1">
        <img src="/images/logo-it.svg" alt="Logo" class="h-22 mx-auto mb-4 lg:hidden" />
        <slot />
      </div>

      <!-- Rodapé -->
      <div v-if="!hiddenLinksFooter" class="absolute bottom-6 text-center text-gray-400 text-xs z-3">
        <NuxtLink to="/politica-de-privacidade" target="_blank" class="hover:text-gray-600">Política de Privacidade</NuxtLink>
        <span class="mx-2">|</span>
        <NuxtLink to="/politica-de-privacidade#base-legal" class="hover:text-gray-600">Termos LGPD</NuxtLink>
      </div>

      <!-- Shapes -->
      <div class="absolute -top-[10%] -right-[5%] w-118.75 h-118.75 hidden lg:inline-block rounded-full bg-linear-to-b from-[#F0F1FF] to-[#D1D4FE] opacity-[0.05] lg:opacity-[0.3]"></div>
      <div class="absolute -bottom-[10%] -left-[5%] w-118.75 h-118.75 hidden lg:inline-block rounded-full bg-linear-to-b from-[#F0F1FF] to-[#D1D4FE] opacity-[0.05] lg:opacity-[0.3]"></div>
    </div>
  </div>
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
      opacity: 0.5;
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
      opacity: 0.5;
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

  #socials::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -15%;
    width: 130%;
    height: 40px;
    z-index: -1;
    padding: 0 50px;
    border: 1px solid #2735F8;
  }
</style>
