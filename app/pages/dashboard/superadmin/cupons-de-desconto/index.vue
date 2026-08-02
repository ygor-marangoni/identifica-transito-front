<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import PaginationControls from '~/components/PaginationControls.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { BadgeCheck, Ticket } from '@lucide/vue';

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
const sortBy = ref('recent');
const filtersOpen = ref(false);
let searchDebounce: ReturnType<typeof setTimeout> | null = null;
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 });
const couponSortOptions = [
    { label: 'Mais recentes', value: 'recent' },
    { label: 'Mais antigos', value: 'oldest' },
    { label: 'Código: A–Z', value: 'code-asc' },
    { label: 'Código: Z–A', value: 'code-desc' },
    { label: 'Mais utilizados', value: 'used-desc' },
];

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
const scheduleSearch = () => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(onSearch, 280);
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

const isCouponAvailable = (coupon: DiscountCoupon) => {
    const hasAvailableUses = coupon.qty === null || Number(coupon.used_qty ?? 0) < Number(coupon.qty);
    const isValid = !coupon.expiration_date || new Date(coupon.expiration_date.replace(' ', 'T')).getTime() >= Date.now();
    return hasAvailableUses && isValid;
};

const availableCoupons = computed(() => coupons.value.filter(isCouponAvailable).length);
const filteredCoupons = computed(() => [...coupons.value].sort((first, second) => {
    if (sortBy.value === 'code-asc') return first.code.localeCompare(second.code);
    if (sortBy.value === 'code-desc') return second.code.localeCompare(first.code);
    if (sortBy.value === 'oldest') return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    if (sortBy.value === 'used-desc') return Number(second.used_qty ?? 0) - Number(first.used_qty ?? 0);
    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
}));

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
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Cupons de Desconto"
            subtitle="Crie e acompanhe campanhas de desconto para impulsionar as vendas."
            greeting="Campanhas promocionais"
            :showButton="true"
            buttonLabel="Novo Cupom"
            buttonLink="/dashboard/superadmin/cupons-de-desconto/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="admin-orders-page bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="mb-4 flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:justify-between">
                <div>
                    <h2 class="text-[#172b4d]" style="margin:0 0 6px;font-size:25px;font-weight:600;line-height:1.1;">Gerenciamento de cupons</h2>
                    <p class="text-[#52667f]" style="margin:0;font-size:15px;line-height:1.35;">Acompanhe regras, validade e utilização das campanhas promocionais.</p>
                </div>
                <div class="flex items-center gap-4 self-start text-xs font-semibold uppercase tracking-wide text-[#52667f] lg:self-end">
                    <span class="inline-flex items-center gap-1.5"><Ticket :size="15" class="text-[#1f46ee]" />{{ pagination.total }} cupons</span>
                    <span class="inline-flex items-center gap-1.5"><BadgeCheck :size="15" class="text-[#16803c]" />{{ availableCoupons }} disponíveis</span>
                </div>
            </div>

            <button type="button" class="mb-4 flex w-full items-center justify-between border-b border-gray-100 pb-4 text-[15px] font-medium text-[#52667f] md:hidden" @click="filtersOpen = !filtersOpen"><span><i class="pi pi-filter mr-2 text-xs"></i>Filtros</span><i :class="filtersOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-xs"></i></button>
            <div :class="[filtersOpen ? 'max-h-[14rem] mb-6 border-b border-gray-100 pb-5 opacity-100' : 'max-h-0 overflow-hidden opacity-0 pointer-events-none', 'admin-orders-filters grid gap-3 transition-[max-height,opacity,margin,padding] duration-300 md:max-h-none md:overflow-visible md:pointer-events-auto md:mb-6 md:border-b md:border-gray-100 md:pb-5 md:opacity-100 md:grid-cols-2 xl:grid-cols-[minmax(25rem,1.45fr)_minmax(18rem,1fr)] xl:items-center']">
                <div class="relative">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por código do cupom..."
                        class="admin-orders-search h-12 w-full rounded-lg border border-gray-300 pl-9 pr-4 text-sm focus:outline-none"
                        @input="scheduleSearch"
                    />
                </div>
                <SelectInput v-model="sortBy" :options="couponSortOptions" show-icon icon="pi pi-sort-alt" :icon-offset-y="2" wrapper-class="admin-orders-filter-select" select-class="!h-12 !bg-[#fafafa]" list-class="admin-orders-sort-panel" />
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

            <template v-else-if="filteredCoupons.length > 0">
            <div class="admin-orders-table hidden overflow-x-auto rounded-xl border border-[#e8edf5] md:block">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cupom</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Benefício</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Utilização</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Validade</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(coupon, index) in filteredCoupons"
                            :key="coupon.id"
                            class="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td class="py-3 px-4"><div class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-ticket"></i></span><div><p class="m-0 font-mono text-sm font-semibold text-[#172b4d]">{{ coupon.code }}</p><p class="mt-0.5 mb-0 text-xs text-[#64748b]">#{{ coupon.id }}</p></div></div></td>
                            <td class="py-3 px-4 text-center">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeLabel(coupon.type).class">
                                    {{ formatValue(coupon) }} · {{ typeLabel(coupon.type).label }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-center"><p class="m-0 font-semibold text-[#172b4d]">{{ coupon.used_qty ?? 0 }} <span class="font-normal text-[#64748b]">/ {{ formatQty(coupon.qty) }}</span></p><span :class="isCouponAvailable(coupon) ? 'text-[#16803c]' : 'text-[#c24141]'" class="text-xs font-medium">{{ isCouponAvailable(coupon) ? 'Disponível' : 'Indisponível' }}</span></td>
                            <td class="py-3 px-4 text-center text-[#52667f]">{{ formatDate(coupon.expiration_date) }}</td>
                            <td class="py-3 px-4 text-center text-[#52667f]">{{ formatDate(coupon.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-center gap-2">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/cupons-de-desconto/${coupon.id}/editar`"
                                        class="p-1.5 rounded-lg text-[#64748b] hover:bg-[#eef2ff] hover:text-[#1f46ee] transition"
                                        title="Editar"
                                    >
                                        <i class="pi pi-pen-to-square text-sm"></i>
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

            <div class="grid gap-3 md:hidden">
                <article v-for="coupon in filteredCoupons" :key="coupon.id" class="rounded-2xl border border-[#e4eaf2] bg-white p-4">
                    <header class="flex items-center gap-3">
                        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-ticket text-lg"></i></span>
                        <div class="min-w-0 flex-1"><p class="mb-0 truncate font-mono text-sm font-bold text-[#172b4d]">{{ coupon.code }}</p><p class="mt-0.5 mb-0 text-xs text-[#52667f]">Criado em {{ formatDate(coupon.created_at) }}</p></div>
                        <span :class="typeLabel(coupon.type).class" class="shrink-0 rounded-full px-2 py-1 text-xs font-medium">{{ formatValue(coupon) }}</span>
                    </header>
                    <dl class="mt-4 grid grid-cols-3 border-t border-[#edf1f6] pt-3 text-center text-xs text-[#64748b]">
                        <div><dt class="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8291a7]">Tipo</dt><dd class="m-0 font-semibold text-[#172b4d]">{{ typeLabel(coupon.type).label }}</dd></div>
                        <div><dt class="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8291a7]">Uso</dt><dd class="m-0 font-semibold text-[#172b4d]">{{ coupon.used_qty ?? 0 }}/{{ formatQty(coupon.qty) }}</dd></div>
                        <div><dt class="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8291a7]">Validade</dt><dd class="m-0 font-semibold text-[#172b4d]">{{ coupon.expiration_date ? formatDate(coupon.expiration_date).split(',')[0] : 'Sem prazo' }}</dd></div>
                    </dl>
                    <p :class="isCouponAvailable(coupon) ? 'text-[#16803c]' : 'text-[#c24141]'" class="mt-3 mb-0 text-center text-xs font-semibold">{{ isCouponAvailable(coupon) ? 'Disponível para uso' : 'Indisponível' }}</p>
                    <div class="mt-4 flex gap-2 border-t border-[#edf1f6] pt-3">
                        <NuxtLink :to="`/dashboard/superadmin/cupons-de-desconto/${coupon.id}/editar`" class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#d8dee8] py-2 text-xs font-semibold text-[#52667f] hover:bg-[#eef2ff] hover:text-[#1f46ee]"><i class="pi pi-pen-to-square"></i>Editar</NuxtLink>
                        <button @click="handleDelete(coupon)" class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"><i class="pi pi-trash"></i>Excluir</button>
                    </div>
                </article>
            </div>
            </template>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-ticket text-4xl"></i>
                <p>Nenhum cupom encontrado</p>
            </div>

            <div v-if="pagination.total >= 26" class="mt-5">
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
