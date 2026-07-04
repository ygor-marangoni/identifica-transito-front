<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import StatsCard from '~/components/superadmin/StatsCard.vue';
import PaginationControls from '~/components/PaginationControls.vue';

definePageMeta({ layout: 'dashboard' });

useHead({
    title: 'Dashboard SuperAdmin - Identifica Trânsito',
    meta: [{ name: 'description', content: 'Painel administrativo geral.' }]
});

const { $api } = useNuxtApp();

// Date filter — default: first day of year → today
const today = new Date();
const firstOfYear = new Date(today.getFullYear(), 0, 1);
const dateFrom = ref(firstOfYear.toISOString().split('T')[0]);
const dateTo = ref(today.toISOString().split('T')[0]);

// Interfaces
interface Totals {
    users: number;
    vehicles: number;
    orders: number;
    revenue: number;
}

interface LatestUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: number;
    created_at: string;
}

interface LatestOrder {
    id: number;
    mp_payment_id: string;
    mp_payment_status: string;
    payment_method: string;
    qty: number;
    price: string;
    price_total: string;
    status: number;
    created_at: string;
    vehicle: {
        id: number;
        plate: string;
        name: string;
        color: string;
        year: string;
    } | null;
}

interface DashboardData {
    totals: Totals;
    latest_users: LatestUser[];
    latest_orders: LatestOrder[];
}

interface PdvCommission {
    admin_id: number;
    admin_name: string;
    admin_email: string;
    pdv_id: number | null;
    pdv_name: string | null;
    commission_type: 1 | 2 | null;
    commission_type_label: string | null;
    commission_value: number | null;
    total_sales_qty: number;
    total_sales_amount: number;
    commission_amount: number;
}

// State
const loading = ref(false);
const dashboardData = ref<DashboardData | null>(null);

const totals = computed(() => dashboardData.value?.totals ?? { users: 0, vehicles: 0, orders: 0, revenue: 0 });
const latestUsers = computed(() => dashboardData.value?.latest_users ?? []);
const latestOrders = computed(() => dashboardData.value?.latest_orders ?? []);

const fetchDashboard = async () => {
    loading.value = true;
    try {
        const res = await $api(`/admin/dashboard?date_from=${dateFrom.value}&date_to=${dateTo.value}`) as any;
        dashboardData.value = res?.data ?? res;
    } catch (e) {
        console.error('Erro ao carregar dashboard:', e);
    } finally {
        loading.value = false;
    }
};

// ── PDV Commissions (repasses) — SuperAdmin only, uses the same date filter above ──
const commissions = ref<PdvCommission[]>([]);
const loadingCommissions = ref(false);
const commissionSearch = ref('');
const commissionsPagination = ref({ currentPage: 1, lastPage: 1, total: 0 });
const commissionsExpanded = ref(false);

const fetchCommissions = async (page = 1) => {
    loadingCommissions.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '12' });
        if (dateFrom.value) params.set('date_from', dateFrom.value);
        if (dateTo.value) params.set('date_to', dateTo.value);
        if (commissionSearch.value) params.set('q', commissionSearch.value);
        const res = await $api(`/admin/pdv-commissions?${params}`) as any;
        commissions.value = Array.isArray(res?.data) ? res.data : [];
        commissionsPagination.value.currentPage = Number(res?.meta?.current_page ?? page);
        commissionsPagination.value.lastPage = Number(res?.meta?.last_page ?? 1);
        commissionsPagination.value.total = Number(res?.meta?.total ?? commissions.value.length);
    } catch (e) {
        console.error('Erro ao carregar repasses de PDV:', e);
    } finally {
        loadingCommissions.value = false;
    }
};

const goToCommissionsPage = (page: number) => {
    if (page < 1 || page > commissionsPagination.value.lastPage || page === commissionsPagination.value.currentPage || loadingCommissions.value) return;
    fetchCommissions(page);
};

const onCommissionSearch = () => {
    commissionsPagination.value.currentPage = 1;
    fetchCommissions(1);
};

const applyFilters = () => {
    fetchDashboard();
    commissionsPagination.value.currentPage = 1;
    fetchCommissions(1);
};

// Helpers
const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // Already formatted (dd/mm/yyyy HH:mm:ss) — return date part only
    if (dateStr.includes('/')) return dateStr.split(' ')[0];
    return new Date(dateStr).toLocaleDateString('pt-BR');
};

const typeLabel = (type: number) => {
    if (type === 1) return 'SuperAdmin';
    if (type === 2) return 'Admin';
    return 'Cliente';
};

const paymentMethodLabel = (method: string) => {
    const map: Record<string, string> = {
        credit_card: 'Cartão de Crédito',
        debit_card: 'Cartão de Débito',
        pix: 'Pix',
        boleto: 'Boleto',
        free: 'Gratuito',
    };
    return map[method] ?? method;
};

const paymentStatusBadge = (status: string) => {
    const map: Record<string, { label: string; classes: string }> = {
        approved: { label: 'Aprovado', classes: 'bg-green-50 text-green-700' },
        pending: { label: 'Pendente', classes: 'bg-yellow-50 text-yellow-700' },
        rejected: { label: 'Rejeitado', classes: 'bg-red-50 text-red-700' },
        cancelled: { label: 'Cancelado', classes: 'bg-gray-100 text-gray-600' },
    };
    return map[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
};

onMounted(() => {
    fetchDashboard();
    fetchCommissions();
});
</script>

<template>
    <div class="space-y-8">
        <HeroSection
            title="Dashboard"
            subtitle="Visão geral da plataforma Identifica Trânsito"
            greeting="Painel SuperAdmin"
            :showButton="false"
        />

        <!-- Date Filter -->
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex flex-wrap items-end gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Data inicial</label>
                    <input
                        v-model="dateFrom"
                        type="date"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Data final</label>
                    <input
                        v-model="dateTo"
                        type="date"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    @click="applyFilters"
                    :disabled="loading"
                    class="px-5 py-2 bg-it-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                    <i class="pi pi-filter mr-2"></i>Filtrar
                </button>
            </div>
        </section>

        <!-- Stats Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard
                title="Total de Usuários Ativos"
                :value="totals.users"
                icon="pi pi-users"
                color="blue"
                :loading="loading"
            />
            <StatsCard
                title="Total de Automóveis"
                :value="totals.vehicles"
                icon="pi pi-car"
                color="green"
                :loading="loading"
            />
            <StatsCard
                title="Total de Pedidos"
                :value="totals.orders"
                icon="pi pi-list"
                color="orange"
                :loading="loading"
            />
            <StatsCard
                title="Total de Receita"
                :value="formatCurrency(totals.revenue)"
                icon="pi pi-dollar"
                color="purple"
                :loading="loading"
            />
        </section>

        <!-- Repasses de PDV -->
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <button
                type="button"
                @click="commissionsExpanded = !commissionsExpanded"
                class="w-full flex items-center justify-between gap-4 text-left"
            >
                <div>
                    <h2 class="text-lg! font-semibold text-gray-900 mb-1! flex items-center gap-2">
                        <i class="pi pi-wallet text-it-primary"></i>
                        Repasses de PDV
                    </h2>
                    <p class="text-sm text-gray-500">Valores a repassar aos donos de ponto de venda no período selecionado acima.</p>
                </div>
                <i :class="['pi', commissionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down', 'text-gray-400 text-lg shrink-0']"></i>
            </button>

            <div v-show="commissionsExpanded" class="mt-6">
                <div class="flex flex-wrap items-end justify-end gap-3 mb-6">
                    <div>
                        <label for="commissionSearch" class="block text-xs font-semibold text-gray-600 mb-1">Buscar PDV</label>
                        <input
                            id="commissionSearch"
                            v-model="commissionSearch"
                            type="text"
                            placeholder="Nome ou e-mail"
                            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @keyup.enter="onCommissionSearch"
                        />
                    </div>
                    <button
                        @click="onCommissionSearch"
                        class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </div>

                <!-- Skeleton -->
                <div v-if="loadingCommissions" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton v-for="n in 3" :key="n" height="180px" class="rounded-xl!" />
                </div>

                <!-- Cards -->
                <div v-else-if="commissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        v-for="item in commissions"
                        :key="item.admin_id"
                        class="border border-gray-100 rounded-xl p-5 bg-gray-50/60 hover:border-it-primary transition"
                    >
                        <div class="flex items-start justify-between gap-2 mb-3">
                            <div class="min-w-0">
                                <p class="font-semibold text-gray-900 truncate">{{ item.pdv_name || item.admin_name }}</p>
                                <p class="text-xs text-gray-500 truncate">{{ item.admin_email }}</p>
                            </div>
                            <span
                                v-if="item.commission_type_label"
                                class="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                            >
                                {{ item.commission_type_label }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div>
                                <p class="text-gray-500 text-xs">Etiquetas vendidas</p>
                                <p class="font-semibold text-gray-900">{{ item.total_sales_qty }}</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-xs">Total vendido</p>
                                <p class="font-semibold text-gray-900">{{ formatCurrency(item.total_sales_amount) }}</p>
                            </div>
                        </div>

                        <div v-if="item.commission_value !== null" class="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Taxa configurada</span>
                            <span class="font-medium text-gray-700">
                                {{ item.commission_type === 2 ? `${item.commission_value}%` : formatCurrency(item.commission_value) }}
                            </span>
                        </div>

                        <div class="border-t border-gray-200 pt-3 flex items-center justify-between">
                            <span class="text-sm text-gray-600">A repassar</span>
                            <span class="text-xl font-bold text-it-primary">{{ formatCurrency(item.commission_amount) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Empty -->
                <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                    <i class="pi pi-wallet text-4xl"></i>
                    <p>Nenhum repasse de PDV no período selecionado</p>
                </div>

                <!-- Pagination -->
                <div v-if="commissions.length > 0 && commissionsPagination.lastPage > 1" class="mt-5 pt-4 border-t border-gray-100">
                    <PaginationControls
                        :current-page="commissionsPagination.currentPage"
                        :last-page="commissionsPagination.lastPage"
                        :loading="loadingCommissions"
                        @page-change="goToCommissionsPage"
                    />
                </div>
            </div>
        </section>

        <!-- Bottom panels -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Recent Users Table -->
            <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg! font-semibold text-gray-900 mb-0!">Últimos Usuários Cadastrados</h3>
                    <NuxtLink to="/dashboard/superadmin/usuarios" class="text-xs text-it-primary font-medium hover:underline">Ver todos</NuxtLink>
                </div>

                <!-- Skeleton -->
                <div v-if="loading" class="space-y-3">
                    <div v-for="n in 5" :key="n" class="flex gap-3 items-center">
                        <Skeleton shape="circle" width="36px" height="36px" />
                        <div class="flex-1 space-y-1">
                            <Skeleton width="40%" height="14px" />
                            <Skeleton width="60%" height="12px" />
                        </div>
                        <Skeleton width="15%" height="20px" />
                        <Skeleton width="15%" height="12px" />
                    </div>
                </div>

                <div v-else-if="latestUsers.length > 0" class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b-2 border-gray-200 bg-gray-50">
                                <th class="text-left py-2 px-3 text-gray-700 font-semibold">Nome</th>
                                <th class="text-left py-2 px-3 text-gray-700 font-semibold">E-mail</th>
                                <th class="text-left py-2 px-3 text-gray-700 font-semibold">Tipo</th>
                                <th class="text-left py-2 px-3 text-gray-700 font-semibold">Cadastro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="u in latestUsers"
                                :key="u.id"
                                class="border-b border-gray-50 hover:bg-gray-50 transition"
                            >
                                <td class="py-3 px-3 font-medium text-gray-900">{{ u.name }}</td>
                                <td class="py-3 px-3 text-gray-600">{{ u.email }}</td>
                                <td class="py-3 px-3">
                                    <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {{ typeLabel(u.type) }}
                                    </span>
                                </td>
                                <td class="py-3 px-3 text-gray-500">{{ formatDate(u.created_at) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
                    <i class="pi pi-users text-3xl"></i>
                    <p class="text-sm">Nenhum usuário encontrado</p>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg! font-semibold text-gray-900 mb-0!">Últimos Pedidos</h3>
                    <NuxtLink to="/dashboard/superadmin/pedidos" class="text-xs text-it-primary font-medium hover:underline">Ver todos</NuxtLink>
                </div>

                <!-- Skeleton -->
                <div v-if="loading" class="space-y-4">
                    <div v-for="n in 4" :key="n" class="space-y-2">
                        <Skeleton width="100%" height="16px" />
                        <Skeleton width="70%" height="12px" />
                        <Skeleton width="50%" height="12px" />
                    </div>
                </div>

                <div v-else-if="latestOrders.length > 0" class="space-y-4">
                    <div
                        v-for="order in latestOrders"
                        :key="order.id"
                        class="border border-gray-100 rounded-xl p-4 space-y-2 hover:bg-gray-50 transition"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-sm font-semibold text-gray-900 truncate">
                                {{ order.vehicle?.name ?? `Pedido #${order.id}` }}
                            </span>
                            <span
                                class="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                                :class="paymentStatusBadge(order.mp_payment_status).classes"
                            >
                                {{ paymentStatusBadge(order.mp_payment_status).label }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                            <i class="pi pi-car"></i>
                            <span>{{ order.vehicle?.plate ?? '-' }}</span>
                            <span class="text-gray-300">|</span>
                            <span>{{ paymentMethodLabel(order.payment_method) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-400">{{ formatDate(order.created_at) }}</span>
                            <span class="font-semibold text-gray-800">{{ formatCurrency(order.price_total) }}</span>
                        </div>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
                    <i class="pi pi-inbox text-3xl"></i>
                    <p class="text-sm">Nenhum pedido encontrado</p>
                </div>
            </div>
        </section>
    </div>
</template>
