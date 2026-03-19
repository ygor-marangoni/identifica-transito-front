<script setup lang="ts">
import type { LandingImpactStat } from '../../types/landing';

defineProps<{
    impactStats: LandingImpactStat[];
}>();
</script>

<template>
    <section class="problem-section" aria-labelledby="problema-title">
        <div class="section-inner max-w-310">
            <div class="section-heading">
                <span class="eyebrow">Impacto</span>
                <h2 id="problema-title" class="js-word-title">O trânsito brasileiro cobra um preço alto</h2>
                <p>O projeto nasce como resposta a um cenário em que falta contexto, falta empatia e sobram riscos.</p>
            </div>

            <div class="impact-grid">
                <article v-for="stat in impactStats" :key="stat.value" class="impact-card">
                    <i :class="stat.icon"></i>
                    <strong class="impact-count" :data-target="stat.counterTarget" :data-format="stat.counterFormat">{{ stat.value }}</strong>
                    <p>{{ stat.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>