<script setup>
import { useLayout } from '@/layouts/composables/layout';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppMenu from './AppMenu.vue';
import { PanelLeft } from '@lucide/vue';

const { layoutState, isDesktop, hasOpenOverlay, toggleMenu } = useLayout();
const route = useRoute();
const sidebarRef = ref(null);
const auth = useAuth();
auth.init();
const config = useRuntimeConfig();
const isClient = computed(() => {
    const type = auth.user.value?.type;
    return type === 'client' || type === 'cliente' || type === 3;
});
const isAdmin = computed(() => {
    const type = auth.user.value?.type;
    return type === 'admin' || type === 2 || route.path.startsWith('/dashboard/admin');
});
const isSuperAdmin = computed(() => {
    const type = auth.user.value?.type;
    return type === 'superAdmin' || type === 1 || route.path.startsWith('/dashboard/superadmin');
});
const usesProductLayout = computed(() => isClient.value || isAdmin.value || isSuperAdmin.value);
const dashboardHome = computed(() => isSuperAdmin.value ? '/dashboard/superadmin' : isAdmin.value ? '/dashboard/admin' : '/dashboard');
const toggleClientSidebar = () => {
    if (usesProductLayout.value && isDesktop()) {
        layoutState.clientSidebarCompact = !layoutState.clientSidebarCompact;
        return;
    }

    toggleMenu();
};
let outsideClickListener = null;

watch(
    () => route.path,
    (newPath) => {
        if (isDesktop()) layoutState.activePath = null;
        else layoutState.activePath = newPath;

        layoutState.overlayMenuActive = false;
        layoutState.mobileMenuActive = false;
        layoutState.menuHoverActive = false;
    },
    { immediate: true }
);

watch(hasOpenOverlay, (newVal) => {
    if (isDesktop()) {
        if (newVal) bindOutsideClickListener();
        else unbindOutsideClickListener();
    }
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener) {
        outsideClickListener = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
            }
        };

        document.addEventListener('click', outsideClickListener);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener = null;
    }
};

const isOutsideClicked = (event) => {
    const topbarButtonEl = document.querySelector('.layout-menu-button');

    return !(sidebarRef.value.isSameNode(event.target) || sidebarRef.value.contains(event.target) || topbarButtonEl?.isSameNode(event.target) || topbarButtonEl?.contains(event.target));
};

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});
</script>

<template>
    <div ref="sidebarRef" class="layout-sidebar" :class="{ 'client-sidebar-compact': usesProductLayout && layoutState.clientSidebarCompact }">
        <div v-if="usesProductLayout" class="client-sidebar-brand">
            <NuxtLink :to="dashboardHome" aria-label="Identifica Trânsito - resumo">
                <img class="client-logo-full" :src="`${config.app.baseURL}images/logo-vertical.svg`.replace(/\/+/g, '/')" alt="Identifica Trânsito" />
                <img class="client-logo-mark" :src="`${config.app.baseURL}images/logo-it-icon.svg`.replace(/\/+/g, '/')" alt="Identifica Trânsito" />
            </NuxtLink>
            <button
                type="button"
                class="client-sidebar-toggle"
                :aria-label="layoutState.clientSidebarCompact ? 'Abrir barra lateral' : 'Minimizar barra lateral'"
                :data-tooltip="layoutState.clientSidebarCompact ? 'Abrir barra lateral' : 'Minimizar barra lateral'"
                @click="toggleClientSidebar"
            >
                <PanelLeft :size="20" :stroke-width="1.9" />
            </button>
        </div>
        <AppMenu />
    </div>
</template>
