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
let fontSafetyTimeout: ReturnType<typeof setTimeout> | undefined;
let paintFrame: number | undefined;
let landingDisposed = false;
let sectionRevealObserver: IntersectionObserver | undefined;
const isLandingReady = ref(false);

if (import.meta.client) void waitForLandingV2Ready();

const waitForLandingFonts = () => {
    if (!('fonts' in document)) return Promise.resolve();

    const fonts = document.fonts;
    const primaryFaces = [
        fonts.load('400 1em "Instrument Sans"'),
        fonts.load('500 1em "Instrument Sans"'),
        fonts.load('700 1em "Instrument Sans"')
    ];

    return Promise.all([fonts.ready, ...primaryFaces]).then(() => undefined).catch(() => undefined);
};

const waitForNextFrame = () => new Promise<void>((resolve) => {
    paintFrame = requestAnimationFrame(() => {
        paintFrame = undefined;
        resolve();
    });
});

const waitForStableFirstPaint = () => new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
        if (settled) return;
        settled = true;
        if (fontSafetyTimeout) clearTimeout(fontSafetyTimeout);
        fontSafetyTimeout = undefined;
        resolve();
    };

    // document.fonts is the primary condition. This only prevents a permanent
    // loading state when a third-party font request fails or stalls.
    fontSafetyTimeout = setTimeout(finish, 3200);
    void waitForLandingFonts().then(finish, finish);
});

onMounted(async () => {
    const root = document.querySelector('.landing-v2');
    if (root) {
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
    }

    await waitForStableFirstPaint();
    await nextTick();
    await waitForNextFrame();
    await waitForNextFrame();

    if (landingDisposed) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && root) {
        const revealTargets = Array.from(root.querySelectorAll<HTMLElement>([
            '.v2-network__inner',
            '.v2-daynight__reveal-shell',
            '.v2-platform__reveal-shell',
            '.v2-how-steps__reveal-shell',
            '.v2-pricing__inner',
            '.v2-faq__grid',
            '.v2-closing__cta-inner',
            '.v2-closing__footer-inner'
        ].join(',')));
        revealTargets.forEach((target) => target.classList.add('v2-enter-reveal'));
        sectionRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                (entry.target as HTMLElement).classList.add('is-revealed');
                sectionRevealObserver?.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
        revealTargets.forEach((target) => sectionRevealObserver?.observe(target));
    }
    isLandingReady.value = true;
    releaseLandingV2Ready();
});

onBeforeUnmount(() => {
    landingDisposed = true;
    if (fontSafetyTimeout) clearTimeout(fontSafetyTimeout);
    if (paintFrame !== undefined) cancelAnimationFrame(paintFrame);
    releaseLandingV2Ready();
    removeSmoothLinks?.();
    sectionRevealObserver?.disconnect();
});

useHead({
    title: 'Identifica Trânsito | Mais contexto no trânsito',
    meta: [
        { name: 'description', content: 'Etiquetas refletivas com QR Code para comunicar contexto no trânsito sem expor a identidade civil do motorista.' },
        { name: 'robots', content: 'index,follow,max-image-preview:large' },
        { name: 'theme-color', content: '#061333' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Identifica Trânsito | Mais contexto no trânsito' },
        { property: 'og:description', content: 'Uma sinalização simples para tornar visíveis situações que pedem mais atenção no trânsito.' },
        { property: 'og:url', content: '/' },
        { property: 'og:site_name', content: 'Identifica Trânsito' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Identifica Trânsito | Mais contexto no trânsito' },
        { name: 'twitter:description', content: 'Etiquetas refletivas com QR Code para comunicar contexto no trânsito.' }
    ],
    link: [
        { rel: 'canonical', href: '/' },
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
            url: '/',
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
<div
    class="landing-v2"
    :class="{ 'landing-v2--booting': !isLandingReady, 'landing-v2--ready': isLandingReady }"
    :aria-busy="!isLandingReady"
>
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
    <div v-if="!isLandingReady" class="landing-startup-loader" role="status" aria-live="polite" aria-label="Carregando página">
        <div class="landing-startup-loader__content">
            <img class="landing-startup-loader__logo" src="/landing-v2/images/branding/logo-vertical.svg" alt="Identifica Trânsito" width="172" height="51" decoding="async">
            <div class="landing-startup-loader__progress" aria-hidden="true">
                <span class="landing-startup-loader__track"><span class="landing-startup-loader__fill"></span></span>
                <span class="landing-startup-loader__percent">CARREGANDO</span>
            </div>
        </div>
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
    opacity: 0;
    transition: opacity .18s ease;
}

.landing-v2--booting { visibility: hidden; }
.landing-v2--ready { opacity: 1; }

/* Reveal preparado antes da seção se tornar visível: sem flash de pintura. */
.landing-v2 :deep(.v2-enter-reveal) {
    opacity: 0;
    transform: translate3d(0, 16px, 0);
    transition: opacity 900ms cubic-bezier(.22, 1, .36, 1), transform 900ms cubic-bezier(.22, 1, .36, 1);
    will-change: opacity, transform;
}

.landing-v2 :deep(.v2-enter-reveal.is-revealed) {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

.landing-v2 :deep(.v2-daynight__reveal-shell.v2-enter-reveal),
.landing-v2 :deep(.v2-platform__reveal-shell.v2-enter-reveal),
.landing-v2 :deep(.v2-how-steps__reveal-shell.v2-enter-reveal),
.landing-v2 :deep(.v2-pricing__inner.v2-enter-reveal),
.landing-v2 :deep(.v2-faq__grid.v2-enter-reveal),
.landing-v2 :deep(.v2-closing__cta-inner.v2-enter-reveal),
.landing-v2 :deep(.v2-closing__footer-inner.v2-enter-reveal) {
    transition-duration: 1.4s;
}

.v2-skip-link { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 10px 14px; border-radius: 8px; background: #fff; color: #061333; font-size: 13px; font-weight: 700; transform: translateY(-150%); transition: transform .2s ease; }
.v2-skip-link:focus { transform: translateY(0); }

/* Shared editorial grid: every V2 section starts where the header content starts. */
.landing-v2 :deep(.v2-manifesto),
.landing-v2 :deep(.v2-hero),
.landing-v2 :deep(.v2-story__viewport),
.landing-v2 :deep(.v2-product-flow),
.landing-v2 :deep(.v2-qr),
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

/* Shared animated H2 highlight for Landing V2 only. */
.landing-v2 :deep(.heading-highlight) {
    display: inline-block;
    overflow: visible;
    padding-right: .08em;
    margin-right: -.08em;
    color: #145df5;
    background-image: linear-gradient(
        110deg,
        #145df5 0%,
        #145df5 43%,
        #2f75ff 47%,
        #e3efff 50%,
        #2f75ff 53%,
        #145df5 57%,
        #145df5 100%
    );
    background-repeat: no-repeat;
    background-size: 240% 100%;
    background-position: 100% center;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: none;
    will-change: background-position;
      animation: landing-v2-heading-shine 6s linear infinite;
}

.landing-v2 :deep(.v2-hero__sticker .heading-highlight) {
    display: inline-block;
    box-sizing: content-box;
    font: inherit;
    line-height: inherit;
    overflow: visible;
    padding-right: .08em;
    margin-right: -.08em;
    white-space: nowrap;
}

@keyframes landing-v2-heading-shine {
    0%, 35% { background-position: 100% center; }
    55%, 100% { background-position: 0% center; }
}

@media (prefers-reduced-motion: reduce) {
    .landing-v2 :deep(.heading-highlight) {
        background-position: center;
        animation: none;
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

@media (max-width: 650px) {
    .landing-v2 :deep(.v2-qr) {
        padding-bottom: 24px !important;
    }

    .landing-v2 :deep(.v2-qr__stage) {
        min-height: 360px !important;
        margin-top: 12px !important;
    }

    .landing-v2 :deep(.v2-qr__scanner) {
        left: 0 !important;
        right: 0 !important;
        width: auto !important;
    }

    .landing-v2 :deep(.v2-qr__result) {
        right: 0 !important;
        left: 0 !important;
        width: 100% !important;
        max-width: none !important;
        box-sizing: border-box !important;
    }
}

/* A barra acompanha a linguagem azul da landing sem interferir no layout interno. */
:global(html:has(.landing-v2)) {
    scrollbar-color: #145df5 #eaf2ff;
    scrollbar-width: thin;
}

:global(html:has(.landing-v2)::-webkit-scrollbar) { width: 10px; }
:global(html:has(.landing-v2)::-webkit-scrollbar-track) { background: #eaf2ff; }
:global(html:has(.landing-v2)::-webkit-scrollbar-thumb) {
    border: 2px solid #eaf2ff;
    border-radius: 999px;
    background: linear-gradient(180deg, #2f75ff, #0b42a8);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.28);
}
:global(html:has(.landing-v2)::-webkit-scrollbar-thumb:hover) { background: #145df5; }

@media (max-width: 1000px) {
    .landing-v2 main :deep(h1),
    .landing-v2 main :deep(h2) {
        font-weight: 500 !important;
    }

    .landing-v2 main :deep(.v2-hero__sticker),
    .landing-v2 main :deep(.v2-hero__sticker .heading-highlight) {
        font-weight: 800 !important;
    }

    :global(html:has(.landing-v2)::-webkit-scrollbar) { width: 7px; }
    :global(html:has(.landing-v2)::-webkit-scrollbar-thumb) { border-width: 1px; }
}

@media (prefers-reduced-motion: reduce) {
    .landing-v2 { transition: none; }
    .landing-v2 :deep(.v2-enter-reveal) { opacity: 1; transform: none; transition: none; }
}
</style>
