<script setup>
import { ref } from 'vue';
import { useLayout } from '@/layouts/composables/layout';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const showProfileMenu = ref(false);

// Dados do usuário (você pode integrar com store/composable depois)
const user = ref({
    name: 'Wesley Souza',
    email: 'wesley.souza@example.com',
    avatar: '/images/dashboard/avatar.jpg'
});

const handleLogout = () => {
    console.log('Fazendo logout...');
    // navigateTo('/auth/login');
};

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
                <img src="/images/logo-it-icon.svg" alt="Logo" class="h-10" />
                <span>Identifica Trânsito</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu flex items-center">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content relative">
                    <!-- Profile Button -->
                    <button 
                        type="button" 
                        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        @click="toggleProfileMenu"
                    >
                        <img 
                            :src="user.avatar" 
                            :alt="user.name" 
                            class="w-8 h-8 rounded-full object-cover"
                        />
                    </button>

                    <!-- Profile Dropdown Menu -->
                    <div 
                        v-if="showProfileMenu"
                        class="absolute right-0 top-12 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                        @click.stop
                    >
                        <!-- User Info -->
                        <div class="p-4">
                            <div class="flex items-center gap-3">
                                <img 
                                    :src="user.avatar" 
                                    :alt="user.name" 
                                    class="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p class="font-semibold text-gray-900 mb-0!">{{ user.name }}</p>
                                    <p class="text-sm text-gray-500 mb-0!">{{ user.email }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Separator -->
                        <div class="border-t border-gray-200"></div>

                        <!-- Menu Items -->
                        <div class="p-2">
                            <!-- Meu Perfil -->
                            <NuxtLink 
                                to="/profile"
                                class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                @click="closeProfileMenu"
                            >
                                <i class="pi pi-user text-lg text-it-primary"></i>
                                <span class="font-medium">Meu Perfil</span>
                            </NuxtLink>

                            <!-- Configurações -->
                            <NuxtLink 
                                to="/settings"
                                class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                @click="closeProfileMenu"
                            >
                                <i class="pi pi-cog text-lg text-gray-600"></i>
                                <span class="font-medium">Configurações</span>
                            </NuxtLink>
                        </div>

                        <!-- Separator -->
                        <div class="border-t border-gray-200"></div>

                        <!-- Logout -->
                        <div class="p-2">
                            <button 
                                @click="handleLogout"
                                class="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
