<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Dashboard',
        items: [
            {
                label: 'Resumo',
                icon: 'pi pi-fw pi-home',
                to: '/'
            }
        ]
    },
    {
        label: 'Acesso Rápido',
        path: '/',
        items: [
            {
                label: 'Meus Veículos',
                icon: 'pi pi-fw pi-car',
                to: '/'
            },
            {
                label: 'Meus Pedidos',
                icon: 'pi pi-fw pi-shopping-cart',
                to: '/'
            },
            {
                label: 'Sobre o Projeto',
                icon: 'pi pi-fw pi-info-circle',
                to: '/',
                class: 'rotated-icon'
            },
            {
                label: 'Suporte',
                icon: 'pi pi-fw pi-question-circle',
                to: '/'
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
                to: '/'
            }
        ]
    }
]);

const handleLogout = () => {
    console.log('Fazendo logout...');
    // Adicione lógica de logout aqui
    // navigateTo('/auth/login');
};
</script>

<template>
    <div class="flex flex-col h-full">
        <!-- Menu items -->
        <ul class="layout-menu flex-1">
            <template v-for="(item, i) in model" :key="item">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
        
        <!-- Footer menu -->
        <div class="border-t border-gray-200 p-4 space-y-2">
            <!-- Meu Perfil -->
            <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 text-it-primary hover:bg-blue-50 rounded-lg transition-colors">
                <i class="pi pi-user text-lg"></i>
                <span class="font-medium">Meu Perfil</span>
            </NuxtLink>
            
            <!-- Sair -->
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <i class="pi pi-sign-out text-lg"></i>
                <span class="font-medium">Sair</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
