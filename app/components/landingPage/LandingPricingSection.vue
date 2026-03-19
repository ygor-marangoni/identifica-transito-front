<script setup lang="ts">
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
        <div class="section-inner max-w-310">
            <div class="section-heading section-heading--center section-heading--light">
                <span class="eyebrow">Preço</span>
                <h2 id="preco-title" class="js-word-title">Preço único, simples e acessível</h2>
                <p>Sem mensalidades. Sem surpresas. Você escolhe suas etiquetas e paga uma única vez.</p>
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
                    <li><i class="pi pi-check"></i><span>Kit com etiquetas reflexivas</span></li>
                    <li><i class="pi pi-check"></i><span>Cadastro na plataforma</span></li>
                    <li><i class="pi pi-check"></i><span>Compre quantas etiquetas precisar para todos os carros da casa ou da frota</span></li>
                    <li><i class="pi pi-check"></i><span>Suporte via e-mail e WhatsApp</span></li>
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
        </div>
    </section>
</template>