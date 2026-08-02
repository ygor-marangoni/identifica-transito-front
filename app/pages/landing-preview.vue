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
let loadingTimeout: ReturnType<typeof setTimeout> | undefined;

useHead({
    style: [
        {
            key: 'landing-preview-cloak',
            innerHTML: `.landing-page-loader { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; background: #050a21; opacity: 1; visibility: visible; transition: opacity .45s cubic-bezier(.22, 1, .36, 1), visibility .45s step-end; }
                .landing-page-loader.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
                .landing-page-loader__brand { display: grid; justify-items: center; gap: 1rem; color: #fff; font: 600 .7rem/1 'Figtree', sans-serif; letter-spacing: .16em; text-transform: uppercase; }
                .landing-page-loader__mark { width: 3.5rem; height: 3.5rem; animation: landing-loader-pulse 1.6s cubic-bezier(.45, 0, .55, 1) infinite; }
                .landing-page-loader__ring { fill: none; stroke: #2864ec; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 64; stroke-dashoffset: 46; transform-origin: 50% 50%; animation: landing-loader-ring 1.2s linear infinite; }
                .landing-page-loader__core { fill: #fff; }
                @keyframes landing-loader-ring { to { transform: rotate(360deg); stroke-dashoffset: -64; } }
                @keyframes landing-loader-pulse { 50% { transform: scale(.9); opacity: .72; } }
                @media (prefers-reduced-motion: reduce) { .landing-page-loader__mark, .landing-page-loader__ring { animation: none; } }`
        }
    ]
});

onMounted(() => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            loadingTimeout = window.setTimeout(() => {
                isPageLoading.value = false;
            }, 280);
        });
    });
});

onBeforeUnmount(() => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
});

const {
    activeProjectImage,
    activeTagIndex,
    benefits,
    closeMobileMenu,
    currentYear,
    faqItems,
    featuredTags,
    impactStats,
    isMobileMenuOpen,
    isTagCarouselPaused,
    loginUrl,
    menuItems,
    pricingTagImages,
    projectGallery,
    projectPillars,
    selectTag,
    toggleTagCarousel,
    steps,
    toggleMobileMenu
} = useLandingPreview();
</script>

<template>
    <div
        class="landing-page-loader"
        :class="{ 'is-hidden': !isPageLoading }"
        :aria-hidden="!isPageLoading"
    >
        <div class="landing-page-loader__brand">
            <svg class="landing-page-loader__mark" viewBox="0 0 64 64" aria-hidden="true">
                <circle class="landing-page-loader__ring" cx="32" cy="32" r="22" />
                <path class="landing-page-loader__core" d="M28 18h8v10h10v8H36v10h-8V36H18v-8h10z" />
            </svg>
            <span>Identifica Trânsito</span>
        </div>
    </div>

    <div class="landing-page landing-preview-page bg-[#f5f7ff] text-slate-900">
        <LandingNav
            :menu-items="menuItems"
            :is-mobile-menu-open="isMobileMenuOpen"
            :login-url="loginUrl"
            @toggle-menu="toggleMobileMenu"
            @close-menu="closeMobileMenu"
        />

        <LandingHeroSection :login-url="loginUrl" />

        <main class="lp-shell">
            <LandingImpactSection :impact-stats="impactStats" />
            <LandingProjectSection
                :active-project-image="activeProjectImage"
                :project-gallery="projectGallery"
                :project-pillars="projectPillars"
            />
            <LandingTagsSection
                :active-tag-index="activeTagIndex"
                :featured-tags="featuredTags"
                :is-paused="isTagCarouselPaused"
                @select-tag="selectTag"
                @toggle-carousel="toggleTagCarousel"
            />
            <LandingBenefitsSection :benefits="benefits" />
            <LandingPricingSection :pricing-tag-images="pricingTagImages" :login-url="loginUrl" />
            <LandingStepsSection :steps="steps" />
            <LandingFaqSection :faq-items="faqItems" />
            <LandingCtaSection :login-url="loginUrl" />
        </main>

        <LandingFooter :current-year="currentYear" />
    </div>
</template>
