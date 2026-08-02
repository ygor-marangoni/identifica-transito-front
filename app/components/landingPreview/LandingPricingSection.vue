<script setup lang="ts">
import { CarFront, Headphones, PackageCheck, UserRoundPlus } from '@lucide/vue';

defineProps<{
    pricingTagImages: Array<{
        src: string;
        alt: string;
    }>;
    loginUrl: string;
}>();
</script>

<template>
    <section id="preco" class="pricing-section" aria-labelledby="preco-title">
        <svg class="pricing-divider pricing-divider--top" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
        <div class="section-inner max-w-310">
            <div class="section-heading section-heading--center section-heading--light">
                <span class="eyebrow">{ Segurança e identificação para cada trajeto }</span>
                <h2 id="preco-title" class="js-word-title">Preço único, simples e acessível</h2>
                <p>Etiquetas refletivas para mais segurança em cada trajeto.</p>
            </div>

            <article class="pricing-card">
                <div class="pricing-card__summary">
                    <span class="pricing-card__label">Combo Identifica Trânsito</span>
                    <div class="pricing-card__value">
                        <small>R$</small>
                        <strong>29,90</strong>
                    </div>
                    <p class="pricing-card__meta">Pagamento único, sem recorrência.</p>

                    <a :href="loginUrl" class="pricing-card__cta">Criar minha conta</a>
                </div>

                <ul class="pricing-list">
                    <li><span class="pricing-list__icon"><PackageCheck :size="16" :stroke-width="1.8" aria-hidden="true" /></span><span>Kit com etiquetas refletivas</span></li>
                    <li><span class="pricing-list__icon"><UserRoundPlus :size="16" :stroke-width="1.8" aria-hidden="true" /></span><span>Cadastro na plataforma</span></li>
                    <li><span class="pricing-list__icon"><CarFront :size="16" :stroke-width="1.8" aria-hidden="true" /></span><span>Etiquetas para todos os veículos da sua casa ou frota</span></li>
                    <li><span class="pricing-list__icon"><Headphones :size="16" :stroke-width="1.8" aria-hidden="true" /></span><span>Suporte via e-mail e WhatsApp</span></li>
                </ul>

                <div class="pricing-card__tags">
                    <span class="pricing-card__tags-label">Etiquetas disponíveis:</span>
                    <div class="pricing-card__tags-list">
                        <div v-for="tagImage in pricingTagImages" :key="tagImage.src" class="pricing-tag-chip">
                            <img :src="tagImage.src" :alt="tagImage.alt" class="pricing-tag-chip__image">
                        </div>
                    </div>
                </div>
            </article>
            <p class="pricing-card__notice pricing-card__notice--footer">Permitida a compra de 1 kit de etiqueta por veículo.</p>
        </div>
        <svg class="pricing-divider" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
    </section>
</template>
