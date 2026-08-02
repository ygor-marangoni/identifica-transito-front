<script setup lang="ts">
import { ShieldCheck } from '@lucide/vue';

defineProps<{
    benefits: string[];
}>();

const benefitIcons = ['pi-shield', 'pi-heart', 'pi-id-card', 'pi-eye', 'pi-users'];
</script>

<template>
    <section id="beneficios" class="content-section benefits-editorial-section" aria-labelledby="beneficios-title">
        <div class="section-inner max-w-310">
            <div class="benefits-editorial">
                <aside class="benefits-editorial__visual">
                    <div class="benefits-editorial__visual-frame">
                        <NuxtImg
                            src="/images/lp/o-projeto/imagem-beneficio.webp"
                            alt="Etiqueta Identifica Trânsito com QR Code e mensagem de proteção"
                            width="900"
                            height="1040"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <span class="benefits-editorial__visual-icon" aria-hidden="true"><ShieldCheck :size="42" :stroke-width="1.8" /></span>
                </aside>

                <article class="benefits-editorial__content">
                    <span class="benefits-editorial__eyebrow">Benefícios</span>
                    <h2 id="beneficios-title" class="benefits-editorial__title">Mais clareza para decisões mais humanas no trânsito.</h2>
                    <p class="benefits-editorial__intro">A Identifica Trânsito cria sinais simples para que cada pessoa ao volante compreenda melhor o contexto ao seu redor e conduza com mais atenção.</p>

                    <ul class="benefits-editorial__list">
                        <li v-for="(benefit, index) in benefits.slice(0, 4)" :key="benefit">
                            <span class="benefits-editorial__benefit-icon"><i :class="['pi', benefitIcons[index] || 'pi-check']" aria-hidden="true"></i></span>
                            <span>{{ benefit }}</span>
                        </li>
                    </ul>
                </article>

            </div>
        </div>
    </section>
</template>
