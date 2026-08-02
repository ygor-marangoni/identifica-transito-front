<script setup lang="ts">
defineProps<{ loginUrl: string }>();
</script>

<template>
    <section class="final-cta" aria-labelledby="final-cta-title">
        <svg class="final-cta__divider" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H1440V52C1146 17 294 17 0 52V0Z" /></svg>
        <div class="section-inner final-cta__inner max-w-310">
            <div class="final-cta__copy">
                <img src="/images/logo-horizontal.svg" alt="Identifica Trânsito" class="final-cta__brand">
                <h2 id="final-cta-title">Uma escolha simples para um trânsito mais atento.</h2>
                <p>Cadastre seu veículo, escolha a etiqueta ideal e ajude a tornar cada encontro no trânsito mais seguro e respeitoso.</p>
                <a :href="loginUrl" class="final-cta__button">Criar minha conta <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
            </div>

            <aside class="final-cta__visual">
                <NuxtImg src="/images/lp/o-projeto/imagem-beneficio.webp" alt="Etiqueta Identifica Trânsito e plataforma digital" width="760" height="560" loading="lazy" decoding="async" />
                <span class="final-cta__visual-label">Etiquetas refletivas com QR Code</span>
            </aside>
        </div>
    </section>
</template>
