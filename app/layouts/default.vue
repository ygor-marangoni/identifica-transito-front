<script setup>
    import { useLayout } from '@/layouts/composables/layout';
    const { layoutConfig, isDarkTheme, changeMenuMode } = useLayout();
</script>

<template>
    <div class="clean-layout">
        <NuxtPage />
    </div>
</template>