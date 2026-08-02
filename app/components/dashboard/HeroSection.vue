<script setup>
import {
    CarFront,
    CircleHelp,
    ClipboardList,
    Handshake,
    LayoutDashboard,
    MapPin,
    Tag,
    Ticket,
    UsersRound
} from '@lucide/vue';

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const normalizedBaseURL = computed(() => {
    const base = runtimeConfig.app.baseURL || '/';

    return base.endsWith('/') ? base.slice(0, -1) : base;
});

const heroStyleVars = computed(() => ({
    '--hero-bg-image': `url('${normalizedBaseURL.value}/images/lp/bg-hero.webp')`,
    '--hero-texture-image': `url('${normalizedBaseURL.value}/images/lp/textura-colmeia.webp')`
}));

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    greeting: { type: String, default: null },
    greetingIcon: { type: [Object, Function], default: null },
    showStats: { type: Boolean, default: false },
    stats: { type: Object, default: () => ({}) },
    showButton: { type: Boolean, default: false },
    buttonLabel: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    buttonLinkBack: { type: Boolean, default: false },
    buttonIcon: { type: String, default: 'pi pi-plus' },
    showFilterButton: { type: Boolean, default: false },
    filterLabel: { type: String, default: 'Filtrar período' }
});

const emit = defineEmits(['filter']);

const formattedGreeting = computed(() => props.greeting);

const contextualGreetingIcon = computed(() => {
    if (props.greetingIcon) return props.greetingIcon;

    const pageTitle = props.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR');

    if (pageTitle.includes('pedido')) return ClipboardList;
    if (pageTitle.includes('usuario')) return UsersRound;
    if (pageTitle.includes('veiculo')) return CarFront;
    if (pageTitle.includes('etiqueta')) return Tag;
    if (pageTitle.includes('cupom')) return Ticket;
    if (pageTitle.includes('ponto de venda')) return MapPin;
    if (pageTitle.includes('faq') || pageTitle.includes('pergunta')) return CircleHelp;
    if (pageTitle.includes('dashboard')) return LayoutDashboard;

    return Handshake;
});

const handleGoBack = () => {
    router.back();
};
</script>

<template>
    <section
        id="hero-section"
        :style="heroStyleVars"
        class="text-white rounded-2xl px-8 py-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
        <div class="flex-1">
            <p v-if="props?.greeting" class="relative z-1 flex items-center gap-1.5 text-sm text-white/80">
                <component :is="contextualGreetingIcon" :size="13" :stroke-width="2.1" aria-hidden="true" />
                <span>{{ formattedGreeting }}</span>
            </p>
            <h1 class="text-3xl! font-bold mt-1 text-white! mb-0! relative z-1">{{ props.title }}</h1>
            <p class="text-white/80 mt-2 relative z-1">{{ props.subtitle }}</p>
        </div>

        <!-- Stats (opcional) -->
        <div v-if="props.showStats && Object.keys(props.stats).length > 0" class="relative z-1 flex w-full overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm md:w-auto">
            <div
                v-for="(value, key, index) in props.stats"
                :key="key"
                :class="{ 'border-l border-white/15': index > 0 }"
                class="min-w-0 flex-1 px-5 py-3.5 text-left md:min-w-[10rem] md:flex-none md:px-6 md:text-right"
            >
                <div>
                    <p class="hero-stat-label text-sm font-medium text-white whitespace-nowrap">{{ value.label }}</p>
                    <p class="relative mt-1 text-2xl font-semibold leading-none text-white md:right-0.5">{{ value.count }}</p>
                </div>
            </div>
        </div>

        <!-- Botão (opcional) -->
        <NuxtLink v-if="props.showButton && props.buttonLink && !props.buttonLinkBack" :to="props.buttonLink" class="relative z-1 inline-flex min-h-12 self-start items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/95 px-5 py-3 text-sm font-bold text-[#102b70] transition-colors hover:bg-white md:self-auto">
            <i :class="props.buttonIcon"></i>
            {{ props.buttonLabel }}
        </NuxtLink>
        <button v-if="props.showButton && props.buttonLinkBack" @click="handleGoBack" class="relative z-1 inline-flex min-h-12 self-start items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/95 px-5 py-3 text-sm font-bold text-[#102b70] transition-colors hover:bg-white md:self-auto">
            <i :class="props.buttonIcon"></i>
            {{ props.buttonLabel }}
        </button>
        <button v-if="props.showFilterButton" type="button" class="relative z-1 inline-flex min-h-12 w-full self-start items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/95 px-5 py-3 text-sm font-bold text-[#102b70] transition-colors hover:bg-white md:w-auto md:self-auto" @click="emit('filter', $event)">
            <i class="pi pi-sliders-h"></i>
            {{ props.filterLabel }}
        </button>

        <div class="mask"></div>
        <div class="texture"></div>
    </section>
</template>

<style scoped>
    #hero-section {
        background: linear-gradient(135deg, var(--it-primary), var(--it-primary-light));
        position: relative;
        overflow:  hidden;

        & .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: var(--hero-bg-image);
            background-repeat: no-repeat;
            background-position: center -290px;
            background-size: 100%;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0.2;
            z-index: 0;
        }

        & .texture {
            content: '';
            position: absolute;
            top: 0;
            right: -180px;
            width: 100%;
            max-width: 600px;
            height: 200%;
            background-image: var(--hero-texture-image);
            background-repeat: no-repeat;
            background-position: right 0;
            background-size: 190%;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0.2;
            transform: rotate(42deg);
            z-index: 1;
        }
    }

    @media (max-width: 385px) {
        .hero-stat-label {
            font-size: 0.8rem;
        }
    }

    @media (max-width: 639px) {
        #hero-section {
            padding: 1.25rem;
            border-radius: 1.1rem;
        }

        #hero-section h1 {
            font-size: 1.6rem !important;
        }
    }
</style>
