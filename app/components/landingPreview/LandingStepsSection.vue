<script setup lang="ts">
import type { LandingStep } from '../../types/landing';

defineProps<{
    steps: LandingStep[];
}>();
</script>

<template>
    <section id="como-funciona" class="steps-editorial-section" aria-labelledby="como-funciona-title">
        <div class="section-inner max-w-310">
            <div class="steps-editorial__heading">
                <span class="steps-editorial__eyebrow">Como funciona</span>
                <h2 id="como-funciona-title">Em 4 passos simples</h2>
                <p>Do cadastro à aplicação, tudo acontece de forma simples, rápida e segura.</p>
            </div>

            <ol class="steps-editorial__timeline">
                <li v-for="step in steps" :key="step.number" class="steps-editorial__item">
                    <span class="steps-editorial__number"><span>{{ step.number }}</span></span>
                    <div class="steps-editorial__icon" aria-hidden="true">
                        <i :class="step.icon"></i>
                    </div>
                    <h3 class="steps-editorial__title">{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </li>
            </ol>
        </div>
        <svg class="steps-editorial-divider" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
    </section>
</template>
