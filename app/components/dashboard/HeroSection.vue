<script setup>
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
    showStats: { type: Boolean, default: false },
    stats: { type: Object, default: () => ({}) },
    showButton: { type: Boolean, default: false },
    buttonLabel: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    buttonLinkBack: { type: Boolean, default: false },
    buttonIcon: { type: String, default: 'pi pi-plus' }
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
            <p v-if="props?.greeting" class="text-sm text-white/80">{{ props.greeting }}</p>
            <h1 class="text-3xl! font-bold mt-1 text-white! mb-0!">{{ props.title }}</h1>
            <p class="text-white/80 mt-2">{{ props.subtitle }}</p>
        </div>

        <!-- Stats (opcional) -->
        <div v-if="props.showStats && Object.keys(props.stats).length > 0" class="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
            <div v-for="(value, key) in props.stats" :key="key" class="flex items-center gap-4">
                <div>
                    <p class="text-sm text-white/80">{{ value.label }}</p>
                    <p class="text-2xl font-semibold">{{ value.count }}</p>
                </div>
                <div v-if="key !== Object.keys(props.stats)[Object.keys(props.stats).length - 1]" class="w-px h-10 bg-white/20"></div>
            </div>
        </div>

        <!-- Botão (opcional) -->
        <NuxtLink v-if="props.showButton && props.buttonLink && !props.buttonLinkBack" :to="props.buttonLink" class="px-4 py-2 rounded-lg bg-white text-it-primary font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 whitespace-nowrap">
            <i :class="props.buttonIcon"></i>
            {{ props.buttonLabel }}
        </NuxtLink>
        <button v-if="props.showButton && props.buttonLinkBack" @click="handleGoBack" class="px-4 py-2 rounded-lg bg-white text-it-primary font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 whitespace-nowrap">
            <i :class="props.buttonIcon"></i>
            {{ props.buttonLabel }}
        </button>
    </section>
</template>

<style scoped>
    #hero-section {
        background: linear-gradient(135deg, var(--it-primary), #3b82f6);
        position: relative;
        overflow:  hidden;

        & ::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-image: var(--hero-bg-image);
            background-repeat: no-repeat;
            background-position: center -200px;
            background-size: 100%;
            background-attachment: fixed;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0.05;
            z-index: 0;
        }

        & ::after {
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
            opacity: 0.03;
            transform: rotate(42deg);
            z-index: 1;
        }
    }
</style>