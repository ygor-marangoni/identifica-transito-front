<script setup>
import QuickLink from '~/components/dashboard/QuickLink.vue';
import OrderStatusItem from '~/components/dashboard/OrderStatusItem.vue';

definePageMeta({
    layout: 'dashboard'
});

// Dados de contagem (você pode buscar da API later)
const stats = {
    vehicles: 3,
    orders: 2
};

// Últimos pedidos
const recentOrders = [
    { id: '#PED-1234', title: 'Etiqueta Laranja - 2 unidades', status: 'entregue' },
    { id: '#PED-1235', title: 'Etiqueta Amarela - 1 unidade', status: 'em-rota' },
    { id: '#PED-1236', title: 'Etiqueta Azul - 3 unidades', status: 'em-andamento' }
];
</script>

<template>
    <div class="space-y-10">
        <!-- Hero / Boas-vindas -->
        <section class="bg-it-primary hover:bg-[#1E40AF]! text-white rounded-2xl px-8 py-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-sm text-white/80">Bem-vindo(a) de volta</p>
                <h1 class="text-3xl font-bold mt-1 text-white!">Olá, Wesley!</h1>
                <p class="text-white/80 mt-2">Acesse rapidamente seus veículos, pedidos e suporte.</p>
            </div>
            <div class="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
                <div>
                    <p class="text-sm text-white/80">Veículos ativos</p>
                    <p class="text-2xl font-semibold">03</p>
                </div>
                <div class="w-px h-10 bg-white/20"></div>
                <div>
                    <p class="text-sm text-white/80">Pedidos em andamento</p>
                    <p class="text-2xl font-semibold">02</p>
                </div>
            </div>
        </section>

        <!-- Acesso Rápido -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold text-gray-900">Acesso Rápido</h2>
                <NuxtLink to="/support" class="text-sm text-it-primary hover:underline">Precisa de ajuda?</NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <QuickLink icon="pi pi-car" title="Meus Veículos" to="/vehicles" subtitle="Gerencie e acompanhe" :badge="stats.vehicles" />
                <QuickLink icon="pi pi-list" title="Meus Pedidos" to="/orders" subtitle="Status e histórico" :badge="stats.orders" />
                <QuickLink icon="pi pi-user" title="Meu Perfil" to="/profile" subtitle="Dados e segurança" />
                <QuickLink icon="pi pi-question-circle" title="Suporte" to="/support" subtitle="Fale com a gente" />
            </div>
        </section>

        <!-- Painéis principais -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Projeto -->
            <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-it-primary text-xl">
                        <i class="pi pi-bolt"></i>
                    </div>
                <div>
                        <h3 class="text-xl font-semibold text-gray-900">Conheça o Projeto Identifica Trânsito</h3>
                        <p class="text-sm text-gray-500">Como as etiquetas promovem um trânsito mais seguro e inclusivo.</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink to="/project" class="px-4 py-2 rounded-lg bg-it-primary text-white text-sm font-medium hover:bg-it-secondary transition">Saber Mais</NuxtLink>
                    <NuxtLink to="/project/faq" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-it-primary hover:text-it-primary transition">Perguntas frequentes</NuxtLink>
                </div>
            </div>

            <!-- Status dos Pedidos -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Últimos Pedidos</h3>
                    <NuxtLink to="/orders" class="text-xs text-it-primary font-medium hover:underline">Ver todos</NuxtLink>
                </div>
                <div class="space-y-4">
                    <OrderStatusItem
                        v-for="order in recentOrders"
                        :key="order.id"
                        :order-id="order.id"
                        :title="order.title"
                        :status="order.status"
                    />
                </div>
            </div>
        </section>

        <!-- CTA cadastro veículo -->
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-it-primary text-xl">
                    <i class="pi pi-plus"></i>
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">Cadastre seu Primeiro Veículo</h3>
                    <p class="text-sm text-gray-500">Prepare-se para gerar sua etiqueta de identificação personalizada.</p>
                </div>
            </div>
            <NuxtLink to="/vehicles/new" class="px-5 py-3 rounded-lg bg-it-primary text-white font-semibold hover:bg-it-secondary transition">Cadastrar Veículo</NuxtLink>
        </section>
    </div>
</template>
