<script setup lang="ts">
defineProps<{
    title: string;
    value: string | number;
    icon: string;
    color: 'blue' | 'green' | 'orange' | 'purple';
    loading?: boolean;
}>();

const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700', border: 'border-green-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700', border: 'border-orange-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-700', border: 'border-purple-100' },
};
</script>

<template>
    <div class="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-5" :class="colorMap[color].border">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" :class="colorMap[color].bg">
            <i :class="[icon, 'text-2xl', colorMap[color].icon]"></i>
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500 font-medium truncate">{{ title }}</p>
            <Skeleton v-if="loading" width="80px" height="32px" class="mt-1" />
            <p v-else class="text-3xl font-bold mt-1" :class="colorMap[color].value">{{ value }}</p>
        </div>
    </div>
</template>
