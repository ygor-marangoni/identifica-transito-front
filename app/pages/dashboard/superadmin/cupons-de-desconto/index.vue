<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import PaginationControls from '~/components/PaginationControls.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Cupons de Desconto - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();

interface DiscountCoupon {
    id: number;
    code: string;
    type: number;
    value: string | number;
    qty: number | null;
    used_qty: number | null;
    expiration_date: string | null;
    created_at: string;
    updated_at?: string | null;
}

const coupons = ref<DiscountCoupon[]>([]);
const loading = ref(false);
const search = ref('');
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 });

const fetchCoupons = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('q', search.value);

        const res = await $api(`/admin/discount-coupons?${params}`) as any;
        const payload = res?.data ?? res;
        const meta = res?.meta ?? payload?.meta ?? {};

        if (Array.isArray(payload)) {
            coupons.value = payload;
        } else if (Array.isArray(payload?.data)) {
            coupons.value = payload.data;
        } else {
            coupons.value = [];
        }

        pagination.value.currentPage = Number(meta?.current_page ?? payload?.current_page ?? page);
        pagination.value.lastPage = Number(meta?.last_page ?? payload?.last_page ?? 1);
        pagination.value.total = Number(meta?.total ?? payload?.total ?? coupons.value.length);
    } catch (error) {
        console.error('Erro ao carregar cupons de desconto:', error);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page: number) => {
    if (page < 1 || page > pagination.value.lastPage || page === pagination.value.currentPage || loading.value) return;
    fetchCoupons(page);
};

const onSearch = () => {
    pagination.value.currentPage = 1;
    fetchCoupons(1);
};

const formatDate = (d: string | null) => {
    if (!d) return '-';
    if (d.includes('/')) return d;
    return new Date(d).toLocaleString('pt-BR');
};

const typeLabel = (type: number) => {
    if (type === 2) return { label: 'Valor Fixo', class: 'bg-blue-50 text-blue-700' };
    return { label: 'Percentual', class: 'bg-emerald-50 text-emerald-700' };
};

const formatValue = (coupon: DiscountCoupon) => {
    const numericValue = Number(coupon.value ?? 0);
    if (coupon.type === 2) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
    }
    return `${numericValue}%`;
};

const formatQty = (qty: number | null) => {
    if (qty === null) return 'Ilimitado';
    if (qty === 0) return 'Esgotado';
    return String(qty);
};

const handleDelete = (coupon: DiscountCoupon) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o cupom "${coupon.code}"?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await $api(`/admin/discount-coupons/${coupon.id}`, { method: 'DELETE' });
                toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'Cupom excluído com sucesso.', life: 3000 });
                fetchCoupons(pagination.value.currentPage);
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir o cupom.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        }
    });
};

onMounted(() => fetchCoupons());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Cupons de Desconto"
            subtitle="Gerencie os cupons de desconto disponíveis para compra"
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Novo Cupom"
            buttonLink="/dashboard/superadmin/cupons-de-desconto/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="relative flex-1 min-w-60">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por código do cupom..."
                        class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="onSearch"
                    />
                </div>
                <button
                    @click="onSearch"
                    class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    Buscar
                </button>
                <span class="text-sm text-gray-500 ml-auto">{{ pagination.total }} cupom(ns)</span>
            </div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="4%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="14%" height="20px" />
                    <Skeleton width="14%" height="14px" />
                    <Skeleton width="12%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="18%" height="14px" />
                    <Skeleton width="18%" height="14px" />
                    <Skeleton width="8%" height="28px" />
                </div>
            </div>

            <div v-else-if="coupons.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">#</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Código</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Tipo</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Valor</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Quantidade</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Usado</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Expiração</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-right py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(coupon, index) in coupons"
                            :key="coupon.id"
                            class="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td class="py-3 px-4 text-gray-400 text-xs">{{ (index + 1) + (pagination.currentPage - 1) * 15 }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ coupon.code }}</td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeLabel(coupon.type).class">
                                    {{ typeLabel(coupon.type).label }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-gray-700 font-medium">{{ formatValue(coupon) }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ formatQty(coupon.qty) }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ coupon.used_qty ?? 0 }}</td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(coupon.expiration_date) }}</td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(coupon.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-end gap-1">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/cupons-de-desconto/${coupon.id}/editar`"
                                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                        title="Editar"
                                    >
                                        <i class="pi pi-pencil text-sm"></i>
                                    </NuxtLink>
                                    <button
                                        @click="handleDelete(coupon)"
                                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                        title="Excluir"
                                    >
                                        <i class="pi pi-trash text-sm"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-ticket text-4xl"></i>
                <p>Nenhum cupom encontrado</p>
            </div>

            <div class="mt-5 pt-4 border-t border-gray-100">
                <PaginationControls
                    :current-page="pagination.currentPage"
                    :last-page="pagination.lastPage"
                    :loading="loading"
                    @page-change="goToPage"
                />
            </div>
        </div>
    </div>
</template>
