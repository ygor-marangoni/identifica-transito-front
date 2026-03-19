<script setup lang="ts">
defineProps<{
    benefits: string[];
}>();
</script>

<template>
    <section id="beneficios" class="content-section" aria-labelledby="beneficios-title">
        <div class="section-inner max-w-310">
            <div class="section-grid section-grid--reverse">
                <article>
                    <div class="section-heading">
                        <span class="eyebrow">Benefícios</span>
                        <h2 id="beneficios-title" class="js-word-title">Por que usar o Identifica Trânsito?</h2>
                    </div>

                    <ul class="benefit-list">
                        <li v-for="benefit in benefits" :key="benefit">
                            <i class="pi pi-check-circle"></i>
                            <span>{{ benefit }}</span>
                        </li>
                    </ul>

                    <div class="benefit-visual__panel">
                        <div class="benefit-visual__badge">
                            <i class="pi pi-qrcode"></i>
                            <span>QR Code contextual</span>
                        </div>
                        <h3>Informação útil sem invasão de privacidade</h3>
                        <p>
                            O foco do sistema é orientar comportamentos mais seguros e humanos no trânsito, nunca expor o
                            motorista. O QR Code da etiqueta leva para a explicação do Projeto e não para identificar pessoas.
                        </p>
                    </div>
                </article>

                <aside class="benefit-visual">
                    <NuxtImg
                        src="/images/lp/beneficios.webp"
                        alt="Ilustração de um QR Code sendo escaneado para mostrar o perfil de condução"
                        width="100%"
                        height="auto"
                        class="benefit-visual__image rounded-lg shadow-md"
                    />
                </aside>
            </div>
        </div>
    </section>
</template>