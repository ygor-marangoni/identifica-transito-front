<script setup lang="ts">
const config = useRuntimeConfig();
const base = config.app.baseURL.replace(/\/$/, '');

useHead({
    link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${base}/images/logo-it-icon.svg` }
    ]
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<!--
/* Evita que uma página renderize estilos transitórios antes da hidratação do Vue. */
-->
