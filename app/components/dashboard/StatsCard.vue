<script setup lang="ts">
defineProps<{
    title: string;
    value: string | number;
    icon: string | object | Function;
    color: 'blue' | 'green' | 'orange' | 'purple' | 'teal';
    loading?: boolean;
}>();

const colorMap = {
    blue: { surface: '#eef2ff', icon: '#1f46ee' },
    green: { surface: '#ecfdf3', icon: '#16803c' },
    orange: { surface: '#fff7e8', icon: '#c66a10' },
    purple: { surface: '#f5f0ff', icon: '#7650c7' },
    teal: { surface: '#eafaf7', icon: '#128071' }
};
</script>

<template>
    <article class="dashboard-stat-card">
        <span
            class="dashboard-stat-icon"
            :style="{ backgroundColor: colorMap[color].surface, color: colorMap[color].icon }"
            aria-hidden="true"
        >
            <i v-if="typeof icon === 'string'" :class="icon"></i>
            <component v-else :is="icon" :size="23" :stroke-width="1.9" />
        </span>
        <div class="min-w-0 flex-1">
            <p class="dashboard-stat-title">{{ title }}</p>
            <Skeleton v-if="loading" width="6rem" height="2rem" class="mt-2 rounded-lg" />
            <p v-else class="dashboard-stat-value">{{ value }}</p>
        </div>
    </article>
</template>

<style scoped>
.dashboard-stat-card {
    display: flex;
    min-height: 8.5rem;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.35rem;
    border: 1px solid #e1e6ee;
    border-radius: 1rem;
    background: #fff;
}

.dashboard-stat-icon {
    display: inline-flex;
    width: 3.5rem;
    height: 3.5rem;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border-radius: 0.85rem;
    font-size: 1.35rem;
}

.dashboard-stat-title {
    overflow: hidden;
    margin: 0;
    color: #64748b;
    font-size: 0.82rem;
    font-weight: 650;
    line-height: 1.35;
    text-overflow: ellipsis;
}

.dashboard-stat-value {
    overflow-wrap: anywhere;
    margin: 0.4rem 0 0;
    color: #172b4d;
    font-size: clamp(1.45rem, 2vw, 1.85rem);
    font-weight: 700;
    line-height: 1.05;
}

@media (max-width: 639px) {
    .dashboard-stat-card {
        min-height: 6.75rem;
        gap: 0.85rem;
        padding: 0.95rem 1rem;
    }

    .dashboard-stat-icon {
        width: 3.1rem;
        height: 3.1rem;
    }

    .dashboard-stat-title {
        font-size: 0.78rem;
    }

    .dashboard-stat-value {
        font-size: 1.5rem;
    }
}
</style>
