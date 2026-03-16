<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { handleLogout } from '@/utils/general';
import AppMenuItem from './AppMenuItem.vue';

const auth = useAuth();
auth.init();

const isSuperAdmin = computed(() => {
    const type = auth.user.value?.type;
    return type === 'superAdmin' || type === 1;
});

const isAdmin = computed(() => {
    const type = auth.user.value?.type;
    return type === 'admin' || type === 2;
});

const clientModel = ref([
    {
        label: 'Dashboard',
        items: [
            {
                label: 'Resumo',
                icon: 'pi pi-fw pi-home',
                to: '/dashboard'
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
                to: '/dashboard/veiculos'
            },
            {
                label: 'Compre Etiquetas',
                icon: 'pi pi-fw pi-shopping-cart',
                to: '/dashboard/etiquetas'
            },
            {
                label: 'Meus Pedidos',
                icon: 'pi pi-fw pi-list',
                to: '/dashboard/pedidos'
            },
            {
                label: 'Sobre o Projeto',
                icon: 'pi pi-fw pi-info-circle',
                to: '/dashboard/sobre',
                class: 'rotated-icon'
            },
            {
                label: 'Suporte',
                icon: 'pi pi-fw pi-question-circle',
                to: '/dashboard/suporte'
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
                to: '/dashboard/configuracoes'
            }
        ]
    },
    {
        label: 'Projeto',
        items: [
            {
                label: 'Sobre o Projeto',
                icon: 'pi pi-fw pi-info-circle',
                to: '/projeto-identifica-transito',
                class: 'rotated-icon'
            },
        ]
    }
]);

const superAdminModel = ref([
    {
        label: 'Dashboard',
        items: [
            {
                label: 'Resumo',
                icon: 'pi pi-fw pi-home',
                to: '/dashboard/superadmin'
            }
        ]
    },
    {
        label: 'Gerenciamento',
        items: [
            {
                label: 'Usuários',
                icon: 'pi pi-fw pi-users',
                to: '/dashboard/superadmin/usuarios'
            },
            {
                label: 'Veículos',
                icon: 'pi pi-fw pi-car',
                to: '/dashboard/superadmin/veiculos'
            },
            {
                label: 'Etiquetas',
                icon: 'pi pi-fw pi-tag',
                to: '/dashboard/superadmin/etiquetas'
            },
            {
                label: 'Pedidos',
                icon: 'pi pi-fw pi-list',
                to: '/dashboard/superadmin/pedidos'
            },
            {
                label: 'Cupom de Desconto',
                icon: 'pi pi-fw pi-ticket',
                to: '/dashboard/superadmin/cupons-de-desconto'
            },
            {
                label: 'Pontos de Venda',
                icon: 'pi pi-fw pi-map-marker',
                to: '/dashboard/superadmin/pontos-de-venda'
            },
            {
                label: 'FAQ',
                icon: 'pi pi-fw pi-question-circle',
                to: '/dashboard/superadmin/faq'
            }
        ]
    },
    {
        label: 'Projeto',
        items: [
            {
                label: 'Sobre o Projeto',
                icon: 'pi pi-fw pi-info-circle',
                to: '/projeto-identifica-transito',
                class: 'rotated-icon'
            },
        ]
    }
]);

const adminModel = ref([
    {
        label: 'Dashboard',
        items: [
            {
                label: 'Resumo',
                icon: 'pi pi-fw pi-home',
                to: '/dashboard/admin'
            }
        ]
    },
    {
        label: 'Gerenciamento',
        items: [
            {
                label: 'Usuários',
                icon: 'pi pi-fw pi-users',
                to: '/dashboard/admin/usuarios'
            },
            {
                label: 'Veículos',
                icon: 'pi pi-fw pi-car',
                to: '/dashboard/admin/veiculos'
            },
            {
                label: 'Pedidos',
                icon: 'pi pi-fw pi-list',
                to: '/dashboard/admin/pedidos'
            }
        ]
    },
    {
        label: 'Projeto',
        items: [
            {
                label: 'Sobre o Projeto',
                icon: 'pi pi-fw pi-info-circle',
                to: '/projeto-identifica-transito',
                class: 'rotated-icon'
            },
        ]
    }
]);

const model = computed(() => {
    if (isSuperAdmin.value) return superAdminModel.value;
    if (isAdmin.value) return adminModel.value;
    return clientModel.value;
});

const toast = useToast();
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
            <NuxtLink to="/dashboard/perfil" class="flex items-center gap-3 px-4 py-3 text-it-primary hover:bg-blue-50 rounded-lg transition-colors">
                <i class="pi pi-user text-lg"></i>
                <span class="font-medium">Meu Perfil</span>
            </NuxtLink>
            
            <!-- Sair -->
            <button @click="() => handleLogout(toast)" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <i class="pi pi-sign-out text-lg"></i>
                <span class="font-medium">Sair</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
