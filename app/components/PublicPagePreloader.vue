<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const isVisible = ref(false);
const previousPath = ref(route.path);

const isPublicRoute = computed(() => {
    return !route.path.startsWith('/dashboard') && !route.path.startsWith('/auth');
});

const showPreloaderForMs = async (duration = 600) => {
    isVisible.value = true;
    
    await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), duration);
    });
    
    isVisible.value = false;
};

onMounted(() => {
    if (isPublicRoute.value) {
        // Show preloader on initial mount
        void showPreloaderForMs(600);
    }
});

// Only trigger on actual path changes, not hash changes
router.beforeEach((to, from) => {
    // Compare paths without hash
    const toPathWithoutHash = to.path;
    const fromPathWithoutHash = from.path;
    
    // Only show preloader if path actually changed (not just hash)
    if (toPathWithoutHash !== fromPathWithoutHash) {
        if (!toPathWithoutHash.startsWith('/dashboard') && !toPathWithoutHash.startsWith('/auth')) {
            previousPath.value = toPathWithoutHash;
            return true;
        }
    }
    
    return true;
});

router.afterEach((to) => {
    // Only show preloader after navigation to different path
    if (to.path !== previousPath.value) {
        if (!to.path.startsWith('/dashboard') && !to.path.startsWith('/auth')) {
            void showPreloaderForMs(600);
        }
    }
});
</script>

<template>
    <Transition name="preloader-fade">
        <div v-if="isPublicRoute && isVisible" class="public-preloader" role="status" aria-live="polite" aria-label="Carregando página">
            <div class="public-preloader__spinner"></div>
        </div>
    </Transition>
</template>

<style scoped>
.public-preloader {
    position: fixed;
    inset: 0;
    z-index: 12000;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 1);
    pointer-events: auto;
    overflow: hidden;
}

.public-preloader__spinner {
    width: 62px;
    height: 62px;
    border-radius: 9999px;
    border: 4px solid rgba(30, 58, 250, 0.15);
    border-top-color: #1e3afa;
    border-right-color: #1e3afa;
    animation: spin 0.75s linear infinite;
}

.preloader-fade-enter-active {
    transition: opacity 0.15s ease-in;
}

.preloader-fade-leave-active {
    transition: opacity 0.3s ease-out;
}

.preloader-fade-enter-from,
.preloader-fade-leave-to {
    opacity: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
