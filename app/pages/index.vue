<script setup lang="ts">
import LandingBenefitsSection from '../components/landingPage/LandingBenefitsSection.vue';
import LandingCtaSection from '../components/landingPage/LandingCtaSection.vue';
import LandingFaqSection from '../components/landingPage/LandingFaqSection.vue';
import LandingFooter from '../components/landingPage/LandingFooter.vue';
import LandingHeroSection from '../components/landingPage/LandingHeroSection.vue';
import LandingImpactSection from '../components/landingPage/LandingImpactSection.vue';
import LandingNav from '../components/landingPage/LandingNav.vue';
import LandingPricingSection from '../components/landingPage/LandingPricingSection.vue';
import LandingProjectSection from '../components/landingPage/LandingProjectSection.vue';
import LandingStepsSection from '../components/landingPage/LandingStepsSection.vue';
import LandingTagsSection from '../components/landingPage/LandingTagsSection.vue';
import { useLandingPage } from '../composables/useLandingPage';

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
    menuItems,
    pricingTagImages,
    projectGallery,
    projectPillars,
    selectTag,
    steps,
    toggleMobileMenu
} = useLandingPage();
</script>

<template>
    <div class="landing-page bg-[#f5f7ff] text-slate-900">
        <LandingNav
            :menu-items="menuItems"
            :is-mobile-menu-open="isMobileMenuOpen"
            @toggle-menu="toggleMobileMenu"
            @close-menu="closeMobileMenu"
        />

        <LandingHeroSection />

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
                @select-tag="selectTag"
            />
            <LandingBenefitsSection :benefits="benefits" />
            <LandingPricingSection :pricing-tag-images="pricingTagImages" />
            <LandingStepsSection :steps="steps" />
            <LandingFaqSection :faq-items="faqItems" />
            <LandingCtaSection />
        </main>

        <LandingFooter :current-year="currentYear" />
    </div>
</template>

<style src="../assets/css/landing-page.css"></style>