<script setup lang="ts">
defineProps<{
    webm?: string;
    mp4?: string;
    poster?: string;
    alt: string;
    objectPosition?: string;
    preload?: 'none' | 'metadata' | 'auto';
    shouldLoad?: boolean;
}>();
</script>

<template>
    <div class="landing-v2-video" :aria-label="alt" role="img">
        <!-- shouldLoad stays false until the corresponding local media file is delivered. -->
        <video
            v-if="shouldLoad"
            class="landing-v2-video__media"
            :poster="poster"
            :preload="preload || 'metadata'"
            autoplay
            muted
            loop
            playsinline
            :style="{ objectPosition: objectPosition || 'center' }"
        >
            <source v-if="webm" :src="webm" type="video/webm">
            <source v-if="mp4" :src="mp4" type="video/mp4">
        </video>
        <div v-else class="landing-v2-video__placeholder" aria-hidden="true">
            <span class="landing-v2-video__grain"></span>
            <span class="landing-v2-video__road"></span>
            <span class="landing-v2-video__light landing-v2-video__light--one"></span>
            <span class="landing-v2-video__light landing-v2-video__light--two"></span>
        </div>
        <span class="landing-v2-video__notice">Mídia cinematográfica pendente</span>
    </div>
</template>

<style scoped>
.landing-v2-video { position: relative; isolation: isolate; width: 100%; height: 100%; overflow: hidden; background: #07132e; }
.landing-v2-video__media, .landing-v2-video__placeholder { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.landing-v2-video__placeholder { background: radial-gradient(circle at 70% 33%, rgba(70, 137, 255, .55), transparent 20%), linear-gradient(145deg, #0a2458 0%, #07132e 48%, #041020 100%); }
.landing-v2-video__road { position: absolute; left: -16%; bottom: -12%; width: 132%; height: 52%; transform: perspective(420px) rotateX(54deg); background: repeating-linear-gradient(90deg, transparent 0 12%, rgba(255,255,255,.9) 12% 18%, transparent 18% 31%), linear-gradient(#1d345e, #061128); opacity: .82; }
.landing-v2-video__light { position: absolute; width: 24vw; height: 24vw; border-radius: 50%; filter: blur(20px); background: rgba(255, 185, 87, .38); }
.landing-v2-video__light--one { top: 7%; right: 9%; }.landing-v2-video__light--two { top: 38%; left: 12%; width: 12vw; height: 12vw; background: rgba(51, 142, 255, .36); }
.landing-v2-video__grain { position:absolute; inset:0; opacity:.25; background-image: radial-gradient(rgba(255,255,255,.45) .5px, transparent .5px); background-size: 5px 5px; mix-blend-mode:soft-light; }
.landing-v2-video__notice { position:absolute; right:1.2rem; bottom:1.1rem; z-index:1; padding:.42rem .66rem; border:1px solid rgba(255,255,255,.18); border-radius:999px; background:rgba(6,19,51,.55); color:rgba(255,255,255,.75); font-size:10px; letter-spacing:.08em; text-transform:uppercase; backdrop-filter:blur(8px); }
</style>
