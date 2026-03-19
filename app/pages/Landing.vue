<script setup lang="ts">
import FeaturesWidget from '@/components/landingPage/FeaturesWidget.vue';
import FooterWidget from '@/components/landingPage/FooterWidget.vue';
import HeroWidget from '@/components/landingPage/HeroWidget.vue';
import HighlightsWidget from '@/components/landingPage/HighlightsWidget.vue';
import PricingWidget from '@/components/landingPage/PricingWidget.vue';
import TopbarWidget from '@/components/landingPage/TopbarWidget.vue';
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static">
                <TopbarWidget />
            </div>
            <HeroWidget />
            <FeaturesWidget />
            <HighlightsWidget />
            <PricingWidget />
            <FooterWidget />
        </div>
    </div>
</template>
