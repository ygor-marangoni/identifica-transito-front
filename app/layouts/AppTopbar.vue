<script setup>
import { computed, ref, watch } from 'vue';
import { useLayout } from '@/layouts/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { handleLogout } from '@/utils/general';
import { useToast } from 'primevue/usetoast';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const showProfileMenu = ref(false);

const auth = useAuth();
auth.init();

const toast = useToast();
const config = useRuntimeConfig();

const userName = computed(() => auth.user.value?.name || 'Usuario');
const userEmail = computed(() => auth.user.value?.email || '');
const lastAvatar = ref('');
const defaultAvatar = `${config.app.baseURL}images/dashboard/avatar.jpg`.replace(/\/+/g, '/');
const userAvatar = computed(() => auth.user.value?.photo || lastAvatar.value || defaultAvatar);

watch(
    () => auth.user.value?.photo,
    (photo) => {
        if (photo) lastAvatar.value = photo;
    },
    { immediate: true }
);

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const closeProfileMenu = () => {
    showProfileMenu.value = false;
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img :src="`${config.app.baseURL}images/logo-it-icon.svg`.replace(/\/+/g, '/')" alt="Logo" class="h-10" />
                <span>Identifica Trânsito</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <!-- <div class="layout-config-menu flex items-center">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div> -->

            <!-- Data atual -->
            <div class="layout-topbar-date hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-surface-700 rounded-lg">
                <i class="pi pi-calendar text-it-primary"></i>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content relative">
                    <!-- Profile Button -->
                    <button 
                        type="button" 
                        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors"
                        @click="toggleProfileMenu"
                    >
                        <img 
                            :src="userAvatar" 
                            :alt="userName" 
                            class="w-8 h-8 rounded-full object-cover"
                        />
                    </button>

                    <!-- Profile Dropdown Menu -->
                    <div 
                        v-if="showProfileMenu"
                        class="absolute right-0 top-12 mt-2 w-64 bg-white dark:bg-surface-800 rounded-lg shadow-xl border border-gray-200 dark:border-surface-700 z-50"
                        @click.stop
                    >
                        <!-- User Info -->
                        <div class="p-4">
                            <div class="flex items-center gap-3">
                                <img 
                                    :src="userAvatar" 
                                    :alt="userName" 
                                    class="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p class="font-semibold text-gray-900 dark:text-white mb-0!">{{ userName }}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-0! overflow-hidden text-ellipsis max-w-36.25">{{ userEmail }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Separator -->
                        <div class="border-t border-gray-200 dark:border-surface-700"></div>

                        <!-- Menu Items -->
                        <div class="p-2">
                            <!-- Meu Perfil -->
                            <NuxtLink 
                                to="/dashboard/perfil"
                                class="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                                @click="closeProfileMenu"
                            >
                                <i class="pi pi-user text-lg text-it-primary"></i>
                                <span class="font-medium">Meu Perfil</span>
                            </NuxtLink>

                            <!-- Configurações -->
                            <NuxtLink 
                                to="/dashboard/configuracoes"
                                class="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                                @click="closeProfileMenu"
                            >
                                <i class="pi pi-cog text-lg text-gray-600 dark:text-gray-400"></i>
                                <span class="font-medium">Configurações</span>
                            </NuxtLink>
                        </div>

                        <!-- Separator -->
                        <div class="border-t border-gray-200 dark:border-surface-700"></div>

                        <!-- Logout -->
                        <div class="p-2">
                            <button 
                                @click="() => handleLogout(toast)"
                                class="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <i class="pi pi-sign-out text-lg"></i>
                                <span class="font-medium">Sair</span>
                            </button>
                        </div>
                    </div>

                    <!-- Overlay to close menu -->
                    <div 
                        v-if="showProfileMenu"
                        class="fixed inset-0 z-40"
                        @click="closeProfileMenu"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
