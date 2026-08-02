<script setup>
const props = defineProps({
    icon: { type: [Object, Function], required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    to: { type: String, required: true },
    badge: { type: [String, Number], default: null }
});
</script>

<template>
    
    <NuxtLink
        :to="props.to"
        class="group relative flex min-h-[8.5rem] flex-col items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-5 py-5 transition-colors hover:border-[#c7d2fe] hover:bg-[#fafbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f46ee]"
    >
        <!-- Badge -->
        <div v-if="props.badge !== null" class="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#1f46ee] text-sm font-bold text-white">
            {{ props.badge }}
        </div>

        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee] transition-colors group-hover:bg-[#dfe7ff]">
            <component :is="props.icon" :size="21" :stroke-width="2" aria-hidden="true" />
        </span>
        <div class="text-center">
            <p class="text-base font-semibold leading-tight text-[#0c0f1a]">{{ props.title }}</p>
            <p v-if="props.subtitle" class="mt-1 text-sm leading-tight text-gray-600">{{ props.subtitle }}</p>
        </div>
    </NuxtLink>
</template>
