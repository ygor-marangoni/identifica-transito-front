<script setup>
    import { useLayout } from '@/layouts/composables/layout';
    // import PublicPagePreloader from '@/components/PublicPagePreloader.vue';
    const { layoutConfig, isDarkTheme, changeMenuMode } = useLayout();
</script>

<template>
    <div class="clean-layout">
        <!-- <PublicPagePreloader /> -->
        <NuxtPage />
    </div>
    <Toast />
</template>