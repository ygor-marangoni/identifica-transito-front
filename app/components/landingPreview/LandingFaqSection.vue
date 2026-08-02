<script setup lang="ts">
import type { LandingFaqItem } from '../../types/landing';

defineProps<{
    faqItems: LandingFaqItem[];
}>();

const closeAnswer = (event: MouseEvent) => {
    (event.currentTarget as HTMLElement).closest('details')?.removeAttribute('open');
};
</script>

<template>
    <section id="faq" class="faq-editorial-section" aria-labelledby="faq-title">
        <div class="section-inner max-w-310">
            <div class="faq-editorial__heading">
                <span class="faq-editorial__eyebrow">FAQ</span>
                <h2 id="faq-title">Perguntas frequentes</h2>
                <p>As dúvidas mais comuns sobre privacidade, funcionamento e uso das etiquetas.</p>
            </div>

            <div class="faq-editorial__panel">
                <details v-for="(item, index) in faqItems" :key="item.question" class="faq-editorial__item">
                    <summary>
                        <span class="faq-editorial__number">{{ String(index + 1).padStart(2, '0') }}.</span>
                        <span>{{ item.question }}</span>
                        <span class="faq-editorial__toggle" aria-hidden="true"><i class="pi pi-plus"></i></span>
                    </summary>
                    <div class="faq-editorial__answer">
                        <p @click="closeAnswer">{{ item.answer }}</p>
                    </div>
                </details>
            </div>

            <p class="faq-editorial__support">Ainda tem dúvidas? <a href="mailto:identificatransito@gmail.com">Fale com a gente.</a></p>
        </div>
    </section>
</template>
