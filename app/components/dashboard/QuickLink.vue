<script setup>
const props = defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    to: { type: String, required: true },
    badge: { type: [String, Number], default: null }
});
</script>

<template>
    
    <NuxtLink
        :to="props.to"
        class="relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-8 shadow-sm hover:-translate-y-1 hover:shadow-lg transition transform"
    >
        <!-- Badge -->
        <div v-if="props.badge !== null" class="absolute top-3 right-3 bg-it-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {{ props.badge }}
        </div>

        <span class="text-3xl text-it-primary">
            <i :class="props.icon + ' text-4xl! '"></i>
        </span>
        <div class="text-center">
            <p class="text-base font-semibold text-gray-900">{{ props.title }}</p>
            <p v-if="props.subtitle" class="text-sm text-gray-500 mt-1">{{ props.subtitle }}</p>
        </div>
    </NuxtLink>
</template>
