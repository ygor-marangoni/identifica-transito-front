<script setup lang="ts">
import type { LandingImpactStat } from '../../types/landing';

defineProps<{
    impactStats: LandingImpactStat[];
}>();
</script>

<template>
    <section class="problem-section" aria-labelledby="problema-title">
        <div class="section-inner max-w-310">
            <div class="impact-intro">
                <div class="impact-intro__heading">
                    <span class="impact-intro__eyebrow">O impacto</span>
                    <h2 id="problema-title" class="js-word-title">O trânsito precisa de mais contexto para ser seguro.</h2>
                </div>
                <p class="impact-intro__description">A informação certa, no momento certo, pode transformar a forma como enxergamos quem está ao nosso lado e tornar cada trajeto mais consciente, respeitoso e seguro.</p>
            </div>

            <div class="impact-grid">
                <article v-for="stat in impactStats" :key="stat.value" class="impact-card">
                    <i :class="stat.icon"></i>
                    <p><strong class="impact-count" :data-target="stat.counterTarget" :data-format="stat.counterFormat">{{ stat.value }}</strong><span>{{ stat.description }}</span></p>
                </article>
            </div>
        </div>
        <svg class="impact-divider" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
    </section>
</template>
