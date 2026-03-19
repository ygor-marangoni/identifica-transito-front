<script setup lang="ts">
import type { LandingFaqItem } from '../../types/landing';

defineProps<{
    faqItems: LandingFaqItem[];
}>();
</script>

<template>
    <section id="faq" class="content-section content-section--faq" aria-labelledby="faq-title">
        <div class="section-inner max-w-310">
            <div class="section-heading section-heading--center">
                <span class="eyebrow">FAQ</span>
                <h2 id="faq-title" class="js-word-title">Perguntas frequentes</h2>
                <p>As dúvidas mais comuns sobre privacidade, funcionamento e uso das etiquetas.</p>
            </div>

            <div class="faq-list">
                <details v-for="item in faqItems" :key="item.question" class="faq-item">
                    <summary>
                        <span>{{ item.question }}</span>
                        <i class="pi pi-plus"></i>
                    </summary>
                    <p>{{ item.answer }}</p>
                </details>
            </div>
        </div>
    </section>
</template>