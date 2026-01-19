<script setup>
  import Carousel from 'primevue/carousel';  
  
  // Carousel data and options
  const items = [
    { text: 'Este projeto inovador tem como objetivo transformar a mobilidade urbana no Brasil por meio de etiquetas de identificação por cores.' },
    { text: 'As etiquetas facilitam a identificação visual dos veículos, promovendo maior segurança e eficiência no trânsito.' },
    { text: 'Com a Identifica Trânsito, esperamos contribuir para um sistema de transporte mais organizado e seguro para todos. Faça parte dessa transformação!' }
  ];

  const responsiveOptions = [];
</script>


<template>
  <div class="flex h-screen bg-[#F0F1FF]">

    <div id="col-one" class="w-1/2 bg-linear-to-b from-[#081AE7] to-[#1925E2] flex flex-col items-center justify-center gap-15 p-12 text-white overflow-hidden relative z-1">
      <div class="text-center relative z-1">
        <NuxtImg src="/images/logo-it-white.svg" alt="Logo" class="h-42 mx-auto mb-4" />
      </div>

      <Carousel :value="items" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplay-interval="10000"  class="w-full max-w-lg mb-8">
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
      <div id="circle" class="absolute -bottom-40 -left-[10%] z-2 w-117.5 h-117.5 rounded-full bg-amber-600"></div>
    </div>

    <!-- Lado Direito - Formulário de Login -->
    <div class="w-1/2 flex flex-col items-center justify-center p-12 relative z-0 overflow-hidden">
      <div class="w-[85%] max-w-171.25 bg-white p-16 rounded-[20px] relative z-1">
        <slot />
      </div>

      <!-- Rodapé -->
      <div class="absolute bottom-6 text-center text-gray-400 text-xs">
        <a href="#" class="hover:text-gray-600">Política de Privacidade</a>
        <span class="mx-2">|</span>
        <a href="#" class="hover:text-gray-600">Termos LGPD</a>
      </div>

      <!-- Shapes -->
       <div class="absolute -top-[10%] -right-[5%] w-118.75 h-118.75 rounded-full bg-linear-to-b from-[#F0F1FF] to-[#D1D4FE] opacity-[0.3]"></div>

       <div class="absolute -bottom-[10%] -left-[5%] w-118.75 h-118.75 rounded-full bg-linear-to-b from-[#F0F1FF] to-[#D1D4FE] opacity-[0.3]"></div>
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
