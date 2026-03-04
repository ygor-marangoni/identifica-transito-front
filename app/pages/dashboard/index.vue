<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    // throw createError({ statusCode: 500, statusMessage: 'Testando erro 500' })
    import HeroSection from '~/components/dashboard/HeroSection.vue';
    import QuickLink from '~/components/dashboard/QuickLink.vue';
    import OrderStatusItem from '~/components/dashboard/OrderStatusItem.vue';
    import ProjectHighlights from '~/components/dashboard/ProjectHighlights.vue';

    interface DashboardOrder {
        id: number | string;
        tag_name?: string;
        mp_payment_id?: number | string;
        vehicle?: { name?: string | null } | null;
        shipment?: { status?: number | string | null } | null;
    }

    definePageMeta({
        layout: 'dashboard',
    });

  useHead({
    title: 'Dashboard - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Visão geral do seu painel de controle.' }
    ]
  });

    // Dados de contagem
    const stats = ref({
        vehicles: 0,
        tags: 2
    });
    
    const loading = ref(false);
    const loadingRecentOrders = ref(false);

    // Últimos pedidos
    const recentOrders = ref<Array<{ id: string; title: string; status: 'em-andamento' | 'em-rota' | 'entregue' | 'cancelado' }>>([]);

    const mapShipmentStatusToCardStatus = (status?: number | string | null): 'em-andamento' | 'em-rota' | 'entregue' | 'cancelado' => {
        const statusKey = String(status ?? '').toLowerCase();

        if (['4', 'entregue', 'delivered'].includes(statusKey)) return 'entregue';
        if (['5', '6', 'failed', 'devolvido', 'returned', 'cancelled', 'cancelado'].includes(statusKey)) return 'cancelado';
        if (['2', '3', 'in_transit', 'out_for_delivery', 'em trânsito', 'em transito'].includes(statusKey)) return 'em-rota';
        return 'em-andamento';
    };

    const heroStats = computed(() => ({
        vehicles: {
            label: 'Veículos ativos',
            count: String(stats.value.vehicles).padStart(2, '0')
        },
        orders: {
            label: 'Etiquetas cadastradas',
            count: String(stats.value.tags).padStart(2, '0')
        }
    }));

    const auth = useAuth();
    auth.init();
    const userName = computed(() => auth.user.value?.name || '');

    const fetchVehiclesCount = async () => {
        try {
            loading.value = true;
            const { $api } = useNuxtApp();
            const response = await $api('/vehicles/count');
            const data = (response as any)?.data ?? response;
            const count = typeof data === 'number' ? data : data?.count;
            if (typeof count === 'number') {
                stats.value.vehicles = count;
            }
        } catch (error) {
            console.error('Erro ao buscar contagem de veículos:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchTagPurchasesCount = async () => {
        try {
            const { $api } = useNuxtApp();
            const response = await $api('/tag-purchases/count');
            const data = (response as any)?.data ?? response;
            const total = typeof data?.total === 'number' ? data.total : Number(data?.total ?? 0);

            if (!Number.isNaN(total)) {
                stats.value.tags = total;
            }
        } catch (error) {
            console.error('Erro ao buscar total de etiquetas cadastradas:', error);
        }
    };

    const fetchRecentOrders = async () => {
        loadingRecentOrders.value = true;
        try {
            const { $api } = useNuxtApp();
            const response = await $api('/orders?page=1&per_page=4') as any;
            const payload = response?.data?.data ? response.data : response;
            const data = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);

            recentOrders.value = (data as DashboardOrder[]).slice(0, 4).map((order) => ({
                id: `#PED-${order.mp_payment_id ?? order.id}`,
                title: order.tag_name
                    ? `${order.tag_name} - 1 unidade`
                    : (order.vehicle?.name || `Pedido ${order.id}`),
                status: mapShipmentStatusToCardStatus(order.shipment?.status)
            }));
        } catch (error) {
            console.error('Erro ao carregar últimos pedidos:', error);
            recentOrders.value = [];
        } finally {
            loadingRecentOrders.value = false;
        }
    };

    onMounted(() => {
        fetchVehiclesCount();
        fetchTagPurchasesCount();
        fetchRecentOrders();
    });
</script>

<template>
    <div class="space-y-10">
        <!-- Hero / Boas-vindas -->
        <HeroSection
            greeting="Bem-vindo(a) de volta"
            :title="userName ? `Olá, ${userName}!` : 'Olá!'"
            subtitle="Acesse rapidamente seus veículos, pedidos e suporte."
            :showStats="true"
            :stats="heroStats"
        />

        <!-- Acesso Rápido -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl! font-semibold text-gray-900">Acesso Rápido</h2>
                <NuxtLink to="/dashboard/suporte" class="text-sm text-it-primary hover:underline">Precisa de ajuda?</NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <QuickLink icon="pi pi-car" title="Meus Veículos" to="/dashboard/veiculos" subtitle="Gerencie e acompanhe" :badge="stats.vehicles" />
                <QuickLink icon="pi pi-list" title="Minhas Etiquetas" to="/dashboard/etiquetas" subtitle="Status e histórico" :badge="stats.tags" />
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
                    <NuxtLink to="/dashboard/pedidos" class="text-xs text-it-primary font-medium hover:underline">Ver todos</NuxtLink>
                </div>
                
                <!-- Com pedidos -->
                <div v-if="loadingRecentOrders" class="space-y-4">
                    <div v-for="n in 4" :key="`recent-order-skeleton-${n}`" class="space-y-2">
                        <Skeleton width="100%" height="16px" />
                        <Skeleton width="60%" height="12px" />
                        <Skeleton width="100%" height="6px" class="rounded-full" />
                    </div>
                </div>

                <div v-else-if="recentOrders.length > 0" class="space-y-4">
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
            <Skeleton v-if="loading" width="70%" height="42px" class="ounded-lg" />
            <div v-else class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-it-primary text-xl">
                    <i class="pi pi-plus"></i>
                </div>
                <div>
                    <h3 class="text-xl! font-semibold text-gray-900 mb-0!">
                        {{ stats.vehicles === 0 ? 'Cadastre seu Primeiro Veículo' : 'Cadastre um Novo Veículo' }}
                    </h3>
                    <p class="text-sm text-gray-500">Prepare-se para gerar sua etiqueta de identificação personalizada.</p>
                </div>
            </div>
            <NuxtLink to="/dashboard/veiculos/novo" class="px-5 py-3 rounded-lg bg-it-primary text-white font-semibold hover:bg-it-secondary transition text-center">Cadastrar Veículo</NuxtLink>
        </section>
    </div>
</template>
