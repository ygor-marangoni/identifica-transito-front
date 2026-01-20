<script setup>
    import HeroSection from '~/components/dashboard/HeroSection.vue';
    import QuickLink from '~/components/dashboard/QuickLink.vue';
    import OrderStatusItem from '~/components/dashboard/OrderStatusItem.vue';
    import ProjectHighlights from '~/components/dashboard/ProjectHighlights.vue';

    definePageMeta({
        layout: 'dashboard',
    });

  useHead({
    title: 'Dashboard - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Visão geral do seu painel de controle.' }
    ]
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
        { id: '#PED-1236', title: 'Etiqueta Azul - 3 unidades', status: 'em-andamento' },
        { id: '#PED-1237', title: 'Etiqueta Verde - 1 unidade', status: 'cancelado' }
    ];

    const heroStats = {
        vehicles: { label: 'Veículos ativos', count: '03' },
        orders: { label: 'Pedidos em andamento', count: '02' }
    };
</script>

<template>
    <div class="space-y-10">
        <!-- Hero / Boas-vindas -->
        <HeroSection
            greeting="Bem-vindo(a) de volta"
            title="Olá, Wesley!"
            subtitle="Acesse rapidamente seus veículos, pedidos e suporte."
            :showStats="true"
            :stats="heroStats"
        />

        <!-- Acesso Rápido -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl! font-semibold text-gray-900">Acesso Rápido</h2>
                <NuxtLink to="/support" class="text-sm text-it-primary hover:underline">Precisa de ajuda?</NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <QuickLink icon="pi pi-car" title="Meus Veículos" to="/dashboard/veiculos" subtitle="Gerencie e acompanhe" :badge="stats.vehicles" />
                <QuickLink icon="pi pi-list" title="Meus Pedidos" to="/dashboard/pedidos" subtitle="Status e histórico" :badge="stats.orders" />
                <QuickLink icon="pi pi-user" title="Meu Perfil" to="/dashboard/perfil" subtitle="Dados e segurança" />
                <QuickLink icon="pi pi-question-circle" title="Suporte" to="/dashboard/suporte" subtitle="Fale com a gente" />
            </div>
        </section>

        <!-- Painéis principais -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Projeto com Carrossel -->
            <ProjectHighlights class="xl:col-span-2" />
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg! font-semibold text-gray-900 mb-0!">Últimos Pedidos</h3>
                    <NuxtLink to="/orders" class="text-xs text-it-primary font-medium hover:underline">Ver todos</NuxtLink>
                </div>
                
                <!-- Com pedidos -->
                <div v-if="recentOrders.length > 0" class="space-y-4">
                    <OrderStatusItem
                        v-for="order in recentOrders"
                        :key="order.id"
                        :order-id="order.id"
                        :title="order.title"
                        :status="order.status"
                    />
                </div>

                <!-- Sem pedidos -->
                <div v-else class="flex flex-col items-center justify-center py-8 space-y-3">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                        <i class="pi pi-inbox"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-gray-600 font-medium">Nenhum pedido ainda</p>
                        <p class="text-sm text-gray-500 mt-1">Comece agora fazendo seu primeiro pedido</p>
                    </div>
                    <NuxtLink to="/orders/new" class="px-4 py-2 rounded-lg bg-it-primary text-white text-sm font-medium hover:bg-it-secondary transition mt-2">Fazer Primeiro Pedido</NuxtLink>
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
                    <h3 class="text-xl! font-semibold text-gray-900 mb-0!">Cadastre seu Primeiro Veículo</h3>
                    <p class="text-sm text-gray-500">Prepare-se para gerar sua etiqueta de identificação personalizada.</p>
                </div>
            </div>
            <NuxtLink to="/vehicles/new" class="px-5 py-3 rounded-lg bg-it-primary text-white font-semibold hover:bg-it-secondary transition text-center">Cadastrar Veículo</NuxtLink>
        </section>
    </div>
</template>
