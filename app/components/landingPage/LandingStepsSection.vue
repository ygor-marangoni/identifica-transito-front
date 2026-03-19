<script setup lang="ts">
import type { LandingStep } from '../../types/landing';

defineProps<{
    steps: LandingStep[];
}>();
</script>

<template>
    <section id="como-funciona" class="content-section content-section--compact" aria-labelledby="como-funciona-title">
        <div class="section-inner max-w-310">
            <div class="section-heading section-heading--center">
                <span class="eyebrow">Como Funciona</span>
                <h2 id="como-funciona-title" class="js-word-title">Em 4 passos simples</h2>
            </div>

            <div class="steps-grid">
                <article v-for="step in steps" :key="step.number" class="step-card">
                    <span class="step-number">{{ step.number }}</span>
                    <div class="step-icon">
                        <i :class="step.icon"></i>
                    </div>
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>