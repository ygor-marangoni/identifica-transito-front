<script setup lang="ts">
import LandingV2Header from '~/components/landingV2/LandingV2Header.vue';
import LandingV2Journey from '~/components/landingV2/LandingV2Journey.vue';
import LandingV2Labels from '~/components/landingV2/LandingV2Labels.vue';
import LandingV2Narrative from '~/components/landingV2/LandingV2Narrative.vue';
import LandingV2Platform from '~/components/landingV2/LandingV2Platform.vue';
import LandingV2Qr from '~/components/landingV2/LandingV2Qr.vue';
import LandingV2Conversion from '~/components/landingV2/LandingV2Conversion.vue';
import LandingV2HowSteps from '~/components/landingV2/LandingV2HowSteps.vue';

let removeSmoothLinks: (() => void) | undefined;

onMounted(() => {
    const root = document.querySelector('.landing-v2');
    if (!root) return;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const handleClick = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const target = document.querySelector(link.hash);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', link.hash);
    };
    links.forEach(link => link.addEventListener('click', handleClick));
    removeSmoothLinks = () => links.forEach(link => link.removeEventListener('click', handleClick));
});

onBeforeUnmount(() => removeSmoothLinks?.());

useHead({
    title: 'Identifica Trânsito | Mais contexto no trânsito',
    meta: [
        { name: 'description', content: 'Etiquetas refletivas com QR Code para comunicar contexto no trânsito sem expor a identidade civil do motorista.' },
        { name: 'robots', content: 'index,follow,max-image-preview:large' },
        { name: 'theme-color', content: '#061333' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Identifica Trânsito | Mais contexto no trânsito' },
        { property: 'og:description', content: 'Uma sinalização simples para tornar visíveis situações que pedem mais atenção no trânsito.' },
        { property: 'og:url', content: '/landing-v2' },
        { property: 'og:site_name', content: 'Identifica Trânsito' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Identifica Trânsito | Mais contexto no trânsito' },
        { name: 'twitter:description', content: 'Etiquetas refletivas com QR Code para comunicar contexto no trânsito.' }
    ],
    link: [
        { rel: 'canonical', href: '/landing-v2' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&display=swap' },
    ],
    script: [{
        type: 'application/ld+json',
        children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Identifica Trânsito | Mais contexto no trânsito',
            description: 'Etiquetas refletivas com QR Code para comunicar contexto no trânsito sem expor a identidade civil do motorista.',
            url: '/landing-v2',
            inLanguage: 'pt-BR',
            isPartOf: { '@type': 'WebSite', name: 'Identifica Trânsito', url: '/' },
            about: { '@type': 'Thing', name: 'Identificação veicular contextual' },
            potentialAction: [
                { '@type': 'ViewAction', target: '#etiquetas', name: 'Conhecer etiquetas' },
                { '@type': 'RegisterAction', target: '/auth/register', name: 'Criar uma conta' }
            ]
        })
    }]
});
</script>

<template>
    <div class="landing-v2">
        <a class="v2-skip-link" href="#conteudo">Ir para o conteúdo principal</a>
        <LandingV2Header />
        <main id="conteudo" tabindex="-1">
            <LandingV2Journey />
            <LandingV2Narrative />
            <LandingV2Qr />
            <LandingV2Labels />
            <LandingV2Platform />
            <LandingV2HowSteps />
            <LandingV2Conversion />
        </main>
    </div>
</template>

<style scoped>
.landing-v2 {
    --v2-grid-max: 1648px;
    --v2-grid-inset: max(24px, calc((100vw - var(--v2-grid-max)) / 2));
    --landing-bg: #fafaf7;
    --landing-surface: #ffffff;
    --landing-text: #101114;
    --landing-text-secondary: #70747c;
    --identifica-blue-950: #061333;
    --identifica-blue-900: #081a46;
    --identifica-blue-700: #0b42a8;
    --identifica-blue-600: #145df5;
    --identifica-blue-500: #2f75ff;
    --identifica-blue-100: #eaf2ff;
    --identifica-blue-50: #f4f8ff;
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    overflow: clip;
    background: var(--landing-bg);
    color: var(--landing-text);
    font-family: 'Instrument Sans', Arial, sans-serif;
}

.v2-skip-link { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 10px 14px; border-radius: 8px; background: #fff; color: #061333; font-size: 13px; font-weight: 700; transform: translateY(-150%); transition: transform .2s ease; }
.v2-skip-link:focus { transform: translateY(0); }

/* Shared editorial grid: every V2 section starts where the header content starts. */
.landing-v2 :deep(.v2-manifesto),
.landing-v2 :deep(.v2-hero),
.landing-v2 :deep(.v2-story__viewport),
.landing-v2 :deep(.v2-product-flow),
.landing-v2 :deep(.v2-qr),
.landing-v2 :deep(.v2-labels),
.landing-v2 :deep(.v2-daynight),
.landing-v2 :deep(.v2-privacy),
.landing-v2 :deep(.v2-platform),
.landing-v2 :deep(.v2-how),
.landing-v2 :deep(.v2-pricing),
.landing-v2 :deep(.v2-faq),
.landing-v2 :deep(.v2-final) {
    padding-left: var(--v2-grid-inset);
    padding-right: var(--v2-grid-inset);
}

.landing-v2 :deep(.v2-manifesto),
.landing-v2 :deep(.v2-product-flow),
.landing-v2 :deep(.v2-platform),
.landing-v2 :deep(.v2-how),
.landing-v2 :deep(.v2-faq) {
    max-width: none;
}

.landing-v2 :deep(.v2-manifesto > *),
.landing-v2 :deep(.v2-product-flow__intro),
.landing-v2 :deep(.v2-product-flow__path),
.landing-v2 :deep(.v2-platform__head),
.landing-v2 :deep(.v2-platform__stage),
.landing-v2 :deep(.v2-how > header),
.landing-v2 :deep(.v2-how__road),
.landing-v2 :deep(.v2-faq > header),
.landing-v2 :deep(.v2-faq__list) {
    width: 100%;
    max-width: var(--v2-grid-max);
    margin-left: auto;
    margin-right: auto;
}

.landing-v2 :deep(.v2-labels__head),
.landing-v2 :deep(.v2-labels__showcase),
.landing-v2 :deep(.v2-labels__tabs),
.landing-v2 :deep(.v2-daynight header),
.landing-v2 :deep(.v2-daynight__compare),
.landing-v2 :deep(.v2-privacy > div),
.landing-v2 :deep(.v2-qr__intro),
.landing-v2 :deep(.v2-qr__stage) {
    max-width: var(--v2-grid-max);
    margin-left: auto;
    margin-right: auto;
}

.landing-v2 :deep(.v2-hero) {
    padding-left: var(--v2-grid-inset);
    padding-right: var(--v2-grid-inset);
}

@media (min-width: 851px) {
    .landing-v2 :deep(.v2-hero__vehicle),
    .landing-v2 :deep(.v2-hero__callouts) {
        right: var(--v2-grid-inset);
    }
}

@media (max-width: 560px) {
    .landing-v2 {
        --v2-grid-inset: 20px;
    }
}

/* Vertical rhythm: reuse the second fold's spacing from fold three onward. */
.landing-v2 :deep(.v2-section03__viewport),
.landing-v2 :deep(.v2-qr),
.landing-v2 :deep(.v2-labels),
.landing-v2 :deep(.v2-platform),
.landing-v2 :deep(.v2-how),
.landing-v2 :deep(.v2-faq),
.landing-v2 :deep(.v2-final) {
    padding-top: clamp(88px, 10vw, 132px) !important;
    padding-bottom: clamp(88px, 10vw, 132px) !important;
}

.landing-v2 :deep(.v2-pricing__copy) {
    padding-top: clamp(88px, 10vw, 132px) !important;
    padding-bottom: clamp(88px, 10vw, 132px) !important;
}

@media (max-width: 800px) {
    .landing-v2 :deep(.v2-section03__viewport),
    .landing-v2 :deep(.v2-qr),
    .landing-v2 :deep(.v2-labels),
    .landing-v2 :deep(.v2-platform),
    .landing-v2 :deep(.v2-how),
    .landing-v2 :deep(.v2-faq),
    .landing-v2 :deep(.v2-final) {
        padding-top: 78px !important;
        padding-bottom: 88px !important;
    }

    .landing-v2 :deep(.v2-pricing__copy) {
        padding-top: 78px !important;
        padding-bottom: 88px !important;
    }
}

@media (max-width: 560px) {
    .landing-v2 :deep(.v2-section03__viewport),
    .landing-v2 :deep(.v2-qr),
    .landing-v2 :deep(.v2-labels),
    .landing-v2 :deep(.v2-platform),
    .landing-v2 :deep(.v2-how),
    .landing-v2 :deep(.v2-faq),
    .landing-v2 :deep(.v2-final) {
        padding-top: 62px !important;
        padding-bottom: 72px !important;
    }

    .landing-v2 :deep(.v2-pricing__copy) {
        padding-top: 62px !important;
        padding-bottom: 72px !important;
    }
}

/* Local exceptions: preserve the animation geometry while balancing each fold. */
.landing-v2 :deep(.v2-section03__viewport) {
    padding-bottom: 320px !important;
}

.landing-v2 :deep(.v2-qr) {
    min-height: auto !important;
    padding-bottom: clamp(32px, 4vw, 64px) !important;
}

.landing-v2 :deep(.v2-qr__stage) {
    min-height: 470px !important;
}

@media (max-width: 800px) {
    .landing-v2 :deep(.v2-section03__viewport) {
        padding-bottom: 150px !important;
    }

    .landing-v2 :deep(.v2-qr) {
        min-height: auto !important;
        padding-bottom: 24px !important;
    }

    .landing-v2 :deep(.v2-qr__stage) {
        min-height: clamp(320px, 85vw, 420px) !important;
    }
}
</style>
