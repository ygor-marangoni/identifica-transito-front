<script setup lang="ts">
import LandingBenefitsSection from '../components/landingPreview/LandingBenefitsSection.vue';
import LandingCtaSection from '../components/landingPreview/LandingCtaSection.vue';
import LandingFaqSection from '../components/landingPreview/LandingFaqSection.vue';
import LandingFooter from '../components/landingPreview/LandingFooter.vue';
import LandingHeroSection from '../components/landingPreview/LandingHeroSection.vue';
import LandingImpactSection from '../components/landingPreview/LandingImpactSection.vue';
import LandingNav from '../components/landingPreview/LandingNav.vue';
import LandingPricingSection from '../components/landingPreview/LandingPricingSection.vue';
import LandingProjectSection from '../components/landingPreview/LandingProjectSection.vue';
import LandingStepsSection from '../components/landingPreview/LandingStepsSection.vue';
import LandingTagsSection from '../components/landingPreview/LandingTagsSection.vue';
import { useLandingPreview } from '../composables/useLandingPreview';

const isPageLoading = ref(true);
let fontFallbackTimeout: ReturnType<typeof setTimeout> | undefined;
let documentLoaderRemovalTimeout: ReturnType<typeof setTimeout> | undefined;

useHead({
    noscript: [
        { innerHTML: '<style>.landing-startup-loader { display: none !important; }</style>' }
    ]
});

onMounted(async () => {
    await nextTick();
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    if (document.fonts?.ready) {
        await Promise.race([
            document.fonts.ready,
            new Promise<void>((resolve) => {
                fontFallbackTimeout = window.setTimeout(resolve, 2000);
            })
        ]);
    }

    isPageLoading.value = false;

    const documentLoader = document.getElementById('document-startup-loader');
    documentLoader?.classList.add('is-leaving');
    documentLoaderRemovalTimeout = window.setTimeout(() => documentLoader?.remove(), 260);
});

onBeforeUnmount(() => {
    if (fontFallbackTimeout) clearTimeout(fontFallbackTimeout);
    if (documentLoaderRemovalTimeout) clearTimeout(documentLoaderRemovalTimeout);
});

const {
    activeProjectImage, activeTagIndex, benefits, closeMobileMenu, currentYear, faqItems,
    featuredTags, impactStats, isMobileMenuOpen, isTagCarouselPaused, loginUrl, menuItems,
    pricingTagImages, projectGallery, projectPillars, selectTag, toggleTagCarousel, steps, toggleMobileMenu
} = useLandingPreview();
</script>

<template>
    <div class="landing-startup-loader" :class="{ 'landing-startup-loader--hidden': !isPageLoading }" role="status" aria-live="polite" aria-label="Carregando página">
        <div class="landing-startup-loader__content">
            <img class="landing-startup-loader__logo" src="/images/logo-vertical.svg" width="172" height="51" alt="Identifica Trânsito">
            <div class="landing-startup-loader__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-label="Carregando página">
                <div class="landing-startup-loader__track"><span class="landing-startup-loader__fill"></span></div>
                <span class="landing-startup-loader__percent">100%</span>
            </div>
        </div>
    </div>

    <div class="landing-page landing-preview-page bg-[#f5f7ff] text-slate-900" :aria-busy="isPageLoading">
        <LandingNav :menu-items="menuItems" :is-mobile-menu-open="isMobileMenuOpen" :login-url="loginUrl" @toggle-menu="toggleMobileMenu" @close-menu="closeMobileMenu" />
        <LandingHeroSection :login-url="loginUrl" />
        <main class="lp-shell">
            <LandingImpactSection :impact-stats="impactStats" />
            <LandingProjectSection :active-project-image="activeProjectImage" :project-gallery="projectGallery" :project-pillars="projectPillars" />
            <LandingTagsSection :active-tag-index="activeTagIndex" :featured-tags="featuredTags" :is-paused="isTagCarouselPaused" @select-tag="selectTag" @toggle-carousel="toggleTagCarousel" />
            <LandingBenefitsSection :benefits="benefits" />
            <LandingPricingSection :pricing-tag-images="pricingTagImages" :login-url="loginUrl" />
            <LandingStepsSection :steps="steps" />
            <LandingFaqSection :faq-items="faqItems" />
            <LandingCtaSection :login-url="loginUrl" />
        </main>
        <LandingFooter :current-year="currentYear" />
    </div>
</template>
