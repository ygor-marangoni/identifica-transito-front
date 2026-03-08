<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';

definePageMeta({ layout: 'dashboard' });

useHead({ title: 'Pedidos - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();

interface Order {
    id: number;
    tag_name: string;
    qty: number;
    price: string;
    price_total: string;
    payment_method: string;
    mp_payment_id?: string | number | null;
    boleto_url?: string | null;
    user?: { name: string } | null;
    vehicle?: { name: string; plate: string } | null;
    shipment?: { status_label?: string; status?: string | number } | null;
    created_at: string;
}

const orders = ref<Order[]>([]);
const loading = ref(false);
const search = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const fetchOrders = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('search', search.value);
        const res = await $api(`/admin/orders?${params}`) as any;
        const payload = res?.data ?? res;
        orders.value = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        currentPage.value = payload?.current_page ?? page;
        lastPage.value = payload?.last_page ?? 1;
        total.value = payload?.total ?? orders.value.length;
    } catch (e) {
        console.error('Erro ao carregar pedidos:', e);
    } finally {
        loading.value = false;
    }
};

const onSearch = () => { currentPage.value = 1; fetchOrders(1); };
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const formatCurrency = (v: string | number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));

const paymentLabel = (method: string) => {
    if (method === 'credit_card') return { label: 'Cartão', class: 'bg-blue-50 text-blue-700' };
    if (method === 'pix') return { label: 'PIX', class: 'bg-green-50 text-green-700' };
    if (method === 'boleto') return { label: 'Boleto', class: 'bg-orange-50 text-orange-700' };
    return { label: method || '-', class: 'bg-gray-100 text-gray-600' };
};

const statusLabel = (shipment: Order['shipment']) => {
    if (!shipment) return { label: 'Aguardando', class: 'bg-yellow-50 text-yellow-700' };
    const label = shipment.status_label || String(shipment.status ?? '');
    const s = String(shipment.status ?? '').toLowerCase();
    if (['4', 'entregue', 'delivered'].includes(s)) return { label: label || 'Entregue', class: 'bg-green-50 text-green-700' };
    if (['5', '6', 'cancelled', 'cancelado'].includes(s)) return { label: label || 'Cancelado', class: 'bg-red-50 text-red-700' };
    if (['2', '3', 'in_transit'].includes(s)) return { label: label || 'Em Trânsito', class: 'bg-blue-50 text-blue-700' };
    return { label: label || 'Em Andamento', class: 'bg-yellow-50 text-yellow-700' };
};

onMounted(() => fetchOrders());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Pedidos"
            subtitle="Todos os pedidos realizados na plataforma"
            greeting="SuperAdmin"
            :showButton="false"
        />

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="relative flex-1 min-w-[240px]">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por etiqueta, cliente..."
                        class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="onSearch"
                    />
                </div>
                <button @click="onSearch" class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Buscar
                </button>
                <span class="text-sm text-gray-500 ml-auto">{{ total }} pedido(s)</span>
            </div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="15%" height="14px" />
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="15%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                </div>
            </div>

            <div v-else-if="orders.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Etiqueta</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Cliente</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Veículo</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Total</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Pagamento</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders" :key="o.id" class="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td class="py-3 px-4 text-gray-400 font-mono text-xs">#{{ o.mp_payment_id ?? o.id }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ o.tag_name }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ o.user?.name || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ o.vehicle?.plate || '-' }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ formatCurrency(o.price_total) }}</td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="paymentLabel(o.payment_method).class">
                                    {{ paymentLabel(o.payment_method).label }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusLabel(o.shipment).class">
                                    {{ statusLabel(o.shipment).label }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(o.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-list text-4xl"></i>
                <p>Nenhum pedido encontrado</p>
            </div>

            <div v-if="lastPage > 1" class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <button :disabled="currentPage === 1" @click="fetchOrders(currentPage - 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    <i class="pi pi-chevron-left text-xs"></i> Anterior
                </button>
                <span class="text-sm text-gray-500">Página {{ currentPage }} de {{ lastPage }}</span>
                <button :disabled="currentPage === lastPage" @click="fetchOrders(currentPage + 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    Próxima <i class="pi pi-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    </div>
</template>
