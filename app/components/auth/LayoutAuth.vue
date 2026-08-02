<script setup lang="ts">
  import { ref } from 'vue';
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

  const activeSlide = ref(0);
  const indicatorsRef = ref<HTMLElement | null>(null);
  const isDraggingIndicators = ref(false);
  const carouselDragStartX = ref<number | null>(null);

  const setSlideFromPointer = (event: PointerEvent) => {
    const indicators = indicatorsRef.value;
    if (!indicators) return;

    const bounds = indicators.getBoundingClientRect();
    const position = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
    const nextSlide = Math.round((position / bounds.width) * (items.length - 1));

    activeSlide.value = nextSlide;
  };

  const startDraggingIndicators = (event: PointerEvent) => {
    isDraggingIndicators.value = true;
    indicatorsRef.value?.setPointerCapture(event.pointerId);
    setSlideFromPointer(event);
  };

  const moveIndicators = (event: PointerEvent) => {
    if (isDraggingIndicators.value) setSlideFromPointer(event);
  };

  const stopDraggingIndicators = () => {
    isDraggingIndicators.value = false;
  };

  const startDraggingCarousel = (event: PointerEvent) => {
    carouselDragStartX.value = event.clientX;
    (event.currentTarget as HTMLElement)?.setPointerCapture(event.pointerId);
  };

  const stopDraggingCarousel = (event: PointerEvent) => {
    if (carouselDragStartX.value === null) return;

    const distance = event.clientX - carouselDragStartX.value;
    if (Math.abs(distance) >= 36) {
      const direction = distance < 0 ? 1 : -1;
      activeSlide.value = (activeSlide.value + direction + items.length) % items.length;
    }

    carouselDragStartX.value = null;
  };
</script>


<template>
  <div id="auth-layout" class="flex md:h-screen min-h-screen md:overflow-hidden bg-[#1925e2] lg:bg-[#F0F1FF] p-3 lg:p-0 relative">

    <!-- Background video (left side) -->
    <video
      id="auth-background-video"
      class="hidden lg:block absolute top-0 left-0 w-1/2 h-full object-cover opacity-20 z-0 pointer-events-none"
      src="/files/video-login.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

      <div id="col-one" class="hidden lg:flex w-1/2 bg-linear-to-b from-[#081AE7]/85 to-[#1925E2]/85 flex-col items-center justify-center gap-15 p-12 text-white overflow-hidden relative z-10">
      <div class="text-center relative z-[3]">
        <img src="/images/logo-it-white.svg" alt="Logo" class="h-52 mx-auto mb-4" />
      </div>

      <div
        class="auth-carousel-drag-area"
        @pointerdown="startDraggingCarousel"
        @pointerup="stopDraggingCarousel"
        @pointercancel="carouselDragStartX = null"
      >
        <Carousel
          v-model:page="activeSlide"
          :value="items"
          :numVisible="1"
          :numScroll="1"
          circular
          :showIndicators="false"
          :autoplay-interval="10000"
          class="w-full max-w-lg mb-8"
        >
          <template #item="slotProps">
              <p class="text-center text-lg font-light leading-8 max-w-md m-auto w-full px-2">
                {{ slotProps.data.text }}
              </p>
          </template>
        </Carousel>
      </div>

      <div
        ref="indicatorsRef"
        class="auth-carousel-indicators"
        :class="{ 'is-dragging': isDraggingIndicators }"
        role="tablist"
        aria-label="Navegação das informações do projeto"
        @pointerdown="startDraggingIndicators"
        @pointermove="moveIndicators"
        @pointerup="stopDraggingIndicators"
        @pointercancel="stopDraggingIndicators"
      >
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="auth-carousel-indicator"
          :class="{ active: activeSlide === index }"
          role="tab"
          :aria-selected="activeSlide === index"
          :aria-label="`Ir para informação ${index + 1}`"
          @click.stop="activeSlide = index"
        />
      </div>

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
            class="auth-social-link"
          >
            <i class="pi pi-instagram text-3xl"></i>
          </a>
          <a
            href="https://wa.me/5511984971689"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp do Identifica Trânsito"
            class="auth-social-link"
          >
            <i class="pi pi-whatsapp text-3xl"></i>
          </a>
        </div>
      </div>

      <!-- circle -->
      <div id="circle" class="absolute -bottom-40 -left-[10%] z-2 w-117.5 h-117.5 rounded-full bg-amber-600"></div>
    </div>

    <!-- Lado Direito - Formulário de Login -->
    <div id="auth-form-panel" class="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-0 min-h-screen md:min-h-full md:overflow-hidden">
      <div class="auth-card w-full md:w-[85%] max-w-171.25 bg-white px-8 pt-8 pb-12 lg:px-12 lg:pt-10 lg:pb-14 rounded-[20px] relative z-1">
        <img src="/images/logo-it.svg" alt="Logo" class="auth-mobile-logo h-22 mx-auto mb-4 lg:hidden" />
        <slot />
      </div>

      <!-- Rodapé -->
      <div v-if="!hiddenLinksFooter" class="absolute bottom-6 text-center text-gray-400 text-xs z-3">
        <NuxtLink to="/politica-de-privacidade" target="_blank" class="hover:text-gray-600">Política de Privacidade</NuxtLink>
        <span class="mx-2">|</span>
        <NuxtLink to="/politica-de-privacidade#base-legal" class="hover:text-gray-600">Termos LGPD</NuxtLink>
      </div>

      <!-- Ambientação visual -->
      <div class="auth-ambient-design" aria-hidden="true"></div>
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

  :deep(h1) {
    color: var(--color-gray-800);
  }

  .auth-card :deep(.p-inputtext),
  .auth-card :deep(.p-inputmask) {
    height: 52px;
    border-color: #cbd5e1;
    background-color: #fff;
    color: #64748b;
  }

  .auth-carousel-drag-area {
    width: 100%;
    display: flex;
    justify-content: center;
    touch-action: pan-y;
    cursor: grab;
    user-select: none;
  }

  .auth-carousel-drag-area :deep(.p-carousel) {
    width: 100%;
  }

  .auth-carousel-drag-area :deep(.p-carousel-content),
  .auth-carousel-drag-area :deep(.p-carousel-item) {
    display: flex;
    justify-content: center;
  }

  .auth-carousel-drag-area:active {
    cursor: grabbing;
  }

  .auth-carousel-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 112px;
    height: 24px;
    margin-top: -18px;
    margin-bottom: 18px;
    touch-action: none;
    cursor: grab;
    user-select: none;
  }

  .auth-carousel-indicators.is-dragging {
    cursor: grabbing;
  }

  .auth-carousel-indicator {
    width: 28px;
    height: 7px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: #424eff;
    opacity: 0.75;
    transition: width 160ms ease, background-color 160ms ease, opacity 160ms ease;
  }

  .auth-carousel-indicator.active {
    width: 28px;
    background: #babfff;
    opacity: 1;
  }

  .auth-carousel-indicator:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  .auth-social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 999px;
    background: #424eff;
    color: #fff;
    transition: transform 160ms ease, background-color 160ms ease;
  }

  .auth-social-link:hover {
    background: #5964ff;
    transform: translateY(-2px);
  }

  .auth-ambient-design {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.72;
    background-image:
      linear-gradient(135deg, rgba(20, 34, 228, 0.06), transparent 42%),
      linear-gradient(rgba(20, 34, 228, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(20, 34, 228, 0.035) 1px, transparent 1px);
    background-size: auto, 36px 36px, 36px 36px;
    mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent);
  }

  .auth-ambient-design::before,
  .auth-ambient-design::after {
    content: '';
    position: absolute;
    width: 76%;
    height: 190px;
    border: 1px solid rgba(20, 34, 228, 0.1);
    border-radius: 999px;
    transform: rotate(-18deg);
  }

  .auth-ambient-design::before {
    top: 8%;
    right: -28%;
  }

  .auth-ambient-design::after {
    bottom: 3%;
    left: -32%;
    transform: rotate(22deg);
    border-color: rgba(20, 34, 228, 0.07);
  }

  @media (max-width: 1165px) {
    #auth-layout {
      background: #f0f1ff;
    }

    #auth-background-video {
      display: none;
    }

    #col-one {
      display: none;
    }

    #auth-form-panel {
      width: 100%;
    }

    .auth-mobile-logo {
      display: block;
    }
  }

  @media (max-width: 650px) {
    #auth-layout {
      background: #fff;
      overflow-x: hidden;
      display: block;
      width: 100%;
      min-width: 0;
      padding: 0;
    }

    #auth-form-panel {
      width: 100%;
      max-width: 100vw;
      min-width: 0;
      margin-left: auto;
      margin-right: auto;
      padding: 4px 0;
      box-sizing: border-box;
    }

    .auth-card {
      width: 100%;
      max-width: 480px;
      min-width: 0;
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      transform: none;
    }

    .auth-card :deep(.p-inputtext),
    .auth-card :deep(.p-inputmask),
    .auth-card :deep(.p-password-input),
    .auth-card :deep(.p-select) {
      height: 52px;
    }
  }
</style>
