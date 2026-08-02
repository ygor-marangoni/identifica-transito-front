<script setup lang="ts">
defineProps<{ loginUrl: string }>();
</script>
<template>
    <section class="hero-card" aria-labelledby="hero-title">
        <div class="hero-media" aria-hidden="true"><video class="hero-video" autoplay muted loop playsinline preload="metadata"><source src="/images/lp/video-hero.mp4" type="video/mp4"></video><div class="hero-media-overlay"></div><div class="hero-textura"></div></div>
        <div class="hero-inner">
            <div class="hero-copy">
                <span class="hero-kicker">{ Projeto de identificação no trânsito }</span>
                <h1 id="hero-title" class="hero-title"><span class="hero-word">Condução</span><span class="hero-word">mais</span><span class="hero-word hero-highlight">segura</span><span class="hero-word">e</span><span class="hero-word hero-highlight">solidária</span><span class="hero-word">nas</span><span class="hero-word">estradas</span><span class="hero-word">de</span><span class="hero-word">todo</span><span class="hero-word">o</span><span class="hero-word">Brasil</span></h1>
                <p class="hero-side-text"><span class="hero-side-text__desktop">Etiquetas refletivas que identificam o perfil de cada motorista, promovendo empatia, respeito e prevenção de acidentes no trânsito.</span><span class="hero-side-text__mobile">Etiquetas refletivas para mais segurança e empatia no trânsito.</span></p>
                <div class="hero-actions"><a href="#etiquetas" class="primary-action">Conhecer Etiquetas</a><a href="#como-funciona" class="secondary-action">Passo a Passo</a></div>
            </div>
        </div>
        <div class="hero-floating-card hero-floating-card--top-left" aria-hidden="true"><div class="hero-insight"><span class="hero-insight__dot"></span><span>Material refletivo</span><strong>leitura dia e noite</strong></div></div>
        <div class="hero-floating-card hero-floating-card--bottom-left" aria-hidden="true"><div class="hero-insight"><span class="hero-insight__dot"></span><span>Mais empatia</span><strong>no trânsito</strong></div></div>
        <div class="hero-floating-card hero-floating-card--top-right" aria-hidden="true"><div class="hero-insight"><span class="hero-insight__dot"></span><span>Etiquetas refletivas</span><strong>mais visibilidade</strong></div></div>
        <div class="hero-floating-card hero-floating-card--bottom-right" aria-hidden="true"><div class="hero-insight"><span class="hero-insight__dot"></span><span>QR Code</span><strong>informação segura</strong></div></div>
        <svg class="hero-divider" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
    </section>
</template>
