<script setup>
const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    greeting: { type: String, default: null },
    showStats: { type: Boolean, default: false },
    stats: { type: Object, default: () => ({}) },
    showButton: { type: Boolean, default: false },
    buttonLabel: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    buttonIcon: { type: String, default: 'pi pi-plus' }
});
</script>

<template>
    <section class="bg-it-primary hover:bg-[#1E40AF]! text-white rounded-2xl px-8 py-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
        <NuxtLink v-if="props.showButton && props.buttonLink" :to="props.buttonLink" class="px-4 py-2 rounded-lg bg-white text-it-primary font-semibold hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap">
            <i :class="props.buttonIcon"></i>
            {{ props.buttonLabel }}
        </NuxtLink>
    </section>
</template>
