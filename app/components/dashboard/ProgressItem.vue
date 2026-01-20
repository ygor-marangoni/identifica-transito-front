<script setup>
const props = defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true }
});
</script>

<template>
    <div class="space-y-1">
        <div class="flex items-center justify-between text-sm text-gray-700">
            <span>{{ props.label }}</span>
            <span class="text-it-primary font-semibold">{{ props.value }}%</span>
        </div>
        <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div class="h-full bg-it-primary" :style="{ width: props.value + '%' }"></div>
        </div>
    </div>
</template>
