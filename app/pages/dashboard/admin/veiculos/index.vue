<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import PaginationControls from '~/components/PaginationControls.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
const route = useRoute();
const isSuperAdminView = computed(() => route.path.startsWith('/dashboard/superadmin'));
useHead({ title: computed(() => isSuperAdminView.value ? 'Veículos - SuperAdmin | Identifica Trânsito' : 'Veículos - Admin | Identifica Trânsito') });

const { $api } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();
const vehiclesApiBase = computed(() => isSuperAdminView.value ? '/admin/vehicles' : '/admin-pdv/vehicles');

interface Vehicle {
    id: number;
    user_id: number;
    plate: string;
    name: string;
    year: string;
    color: string;
    type: number;
    type_label: string;
    register_state: string;
    register_city: string;
    usage_profile: number;
    usage_profile_label: string;
    tag_color: string | null;
    tag_price: string | null;
    tag_purchases: Array<any>;
    user_name?: string | null;
    user_photo?: string | null;
    created_at: string;
}

// Stats
const loadingStats = ref(false);
const vehicleStats = ref({ registered: 0, automobiles: 0, deleted: 0 });

const fetchVehicleStats = async () => {
    loadingStats.value = true;
    try {
        const res = await $api(`${vehiclesApiBase.value}/totals`) as any;
        const data = res?.data ?? res;
        vehicleStats.value.registered = data?.registered ?? 0;
        vehicleStats.value.automobiles = data?.by_type?.find((t: any) => t.id === 1)?.total ?? 0;
        vehicleStats.value.deleted = data?.deleted ?? 0;
    } catch (e) {
        console.error('Erro ao carregar stats de veículos:', e);
    } finally {
        loadingStats.value = false;
    }
};

const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const search = ref('');
const sortBy = ref('recent');
const filtersOpen = ref(false);
let searchDebounce: ReturnType<typeof setTimeout> | null = null;
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 });
const vehicleSortOptions = [{ label: 'Mais recentes', value: 'recent' }, { label: 'Mais antigos', value: 'oldest' }, { label: 'Nome: A–Z', value: 'name-asc' }, { label: 'Placa: A–Z', value: 'plate-asc' }];
const filteredVehicles = computed(() => [...vehicles.value].sort((first, second) => {
    if (sortBy.value === 'oldest') return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    if (sortBy.value === 'name-asc') return first.name.localeCompare(second.name);
    if (sortBy.value === 'plate-asc') return first.plate.localeCompare(second.plate);
    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
}));

const fetchVehicles = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('q', search.value);
        const res = await $api(`${vehiclesApiBase.value}?${params}`) as any;
        vehicles.value = Array.isArray(res?.data) ? res.data : [];
        pagination.value.currentPage = Number(res?.meta?.current_page ?? page);
        pagination.value.lastPage = Number(res?.meta?.last_page ?? 1);
        pagination.value.total = Number(res?.meta?.total ?? vehicles.value.length);
    } catch (e) {
        console.error('Erro ao carregar veículos:', e);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page: number) => {
    if (page < 1 || page > pagination.value.lastPage || page === pagination.value.currentPage || loading.value) return;
    fetchVehicles(page);
};

const onSearch = () => {
    pagination.value.currentPage = 1;
    fetchVehicles(1);
};
const scheduleSearch = () => { if (searchDebounce) clearTimeout(searchDebounce); searchDebounce = setTimeout(onSearch, 280); };

const formatDate = (d: string) => {
    if (!d) return '-';
    if (d.includes('/')) return d.split(' ')[0];
    return new Date(d).toLocaleDateString('pt-BR');
};

const handleDelete = (vehicle: Vehicle) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o veículo "${vehicle.name}" (${vehicle.plate.toUpperCase()})?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await $api(`${vehiclesApiBase.value}/${vehicle.id}`, { method: 'DELETE' });
                toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'Veículo excluído com sucesso.', life: 3000 });
                fetchVehicles(pagination.value.currentPage);
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir o veículo.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        }
    });
};

onMounted(() => {
    fetchVehicleStats();
    fetchVehicles();
});
</script>

<template>
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Veículos"
            :subtitle="isSuperAdminView ? 'Consulte a base veicular e as identificações registradas na plataforma.' : 'Consulte os veículos e as identificações vinculadas ao seu ponto de venda.'"
            :greeting="isSuperAdminView ? 'Base veicular global' : 'Base veicular do PDV'"
            :showButton="false"
        />

        <div class="admin-orders-page bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="mb-4 flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:justify-between"><div><h2 class="text-[#172b4d]" style="margin:0 0 6px;font-size:25px;font-weight:600;line-height:1.1;">Gerenciamento de veículos</h2><p class="text-[#52667f]" style="margin:0;font-size:15px;line-height:1.35;">Acompanhe os veículos cadastrados na plataforma.</p></div><div class="flex items-center gap-5 self-start text-xs font-semibold uppercase tracking-wide text-[#52667f] lg:self-end"><span class="inline-flex items-center gap-1.5"><i class="pi pi-car text-sm text-[#1f46ee]"></i>{{ pagination.total }} veículos</span><span class="inline-flex items-center gap-1.5"><i class="pi pi-check-circle text-sm text-[#16803c]"></i>{{ vehicleStats.automobiles }} automóveis</span></div></div>
            <button type="button" class="mb-4 flex w-full items-center justify-between border-b border-gray-100 pb-4 text-[15px] font-medium text-[#52667f] md:hidden" @click="filtersOpen = !filtersOpen"><span><i class="pi pi-filter mr-2 text-xs"></i>Filtros</span><i :class="filtersOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-xs"></i></button>
            <div :class="[filtersOpen ? 'max-h-[14rem] mb-6 border-b border-gray-100 pb-5 opacity-100' : 'max-h-0 overflow-hidden opacity-0 pointer-events-none', 'admin-orders-filters grid gap-3 transition-[max-height,opacity,margin,padding] duration-300 md:max-h-none md:overflow-visible md:pointer-events-auto md:mb-6 md:border-b md:border-gray-100 md:pb-5 md:opacity-100 md:grid-cols-2 xl:grid-cols-[minmax(25rem,1.45fr)_minmax(18rem,1fr)] xl:items-center']">
                <div class="relative min-w-0">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por placa ou nome..."
                        class="admin-orders-search h-12 w-full pl-9 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none"
                        @input="scheduleSearch"
                    />
                </div>
                <SelectInput v-model="sortBy" :options="vehicleSortOptions" show-icon icon="pi pi-sort-alt" :icon-offset-y="2" wrapper-class="admin-orders-filter-select" select-class="!h-12 !bg-[#fafafa]" list-class="admin-orders-sort-panel" />
            </div>

            <!-- Skeleton -->
            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="4%" height="14px" />
                    <Skeleton width="14%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="10%" height="20px" />
                    <Skeleton width="12%" height="14px" />
                    <Skeleton width="14%" height="14px" />
                    <Skeleton width="6%" height="14px" />
                    <Skeleton width="8%" height="14px" />
                </div>
            </div>

            <!-- Table -->
            <template v-else-if="filteredVehicles.length > 0">
            <div class="admin-orders-table hidden overflow-x-auto rounded-xl border border-[#e8edf5] md:block">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Dono</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Automóvel</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Tipo</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Perfil do Motorista</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Registro</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Tags</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-center py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in filteredVehicles"
                            :key="v.id"
                            class="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td class="py-3 px-4 text-gray-700"><div class="flex items-center gap-2.5"><img :src="v.user_photo || '/images/dashboard/avatar.jpg'" :alt="v.user_name || 'Proprietário'" class="h-8 w-8 rounded-full object-cover ring-2 ring-white" /><span>{{ v.user_name || '-' }}</span></div></td>
                            <td class="py-3 px-4 text-center">
                                <p class="font-medium text-gray-900">{{ v.name }}</p>
                                <div class="mt-0.5 flex items-center justify-center gap-2">
                                    <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 text-xs uppercase">{{ v.plate }}</span>
                                    <span class="text-gray-400 text-xs">{{ v.year }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="capitalize text-gray-700">{{ v.type_label }}</span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="capitalize text-gray-600">{{ v.usage_profile_label }}</span>
                            </td>
                            <td class="py-3 px-4 text-center text-gray-600">
                                {{ v.register_city }} &ndash; {{ v.register_state }}
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center gap-1 text-gray-700 font-medium">
                                    <i class="pi pi-tag text-gray-400 text-xs"></i>
                                    {{ v.tag_purchases?.length ?? 0 }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-center text-gray-500">{{ formatDate(v.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-center">
                                    <button
                                        @click="handleDelete(v)"
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
                <article v-for="v in filteredVehicles" :key="v.id" class="rounded-2xl border border-[#e4eaf2] bg-white p-4"><header class="flex items-start justify-between gap-3"><div><p class="mb-0 text-[15px] font-bold text-[#172b4d]">{{ v.name }}</p><span class="mt-1 inline-block rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[11px] text-[#52667f]">{{ v.plate }}</span></div><span class="text-[13px] text-[#52667f]">{{ formatDate(v.created_at) }}</span></header><dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#edf1f6] pt-3 text-sm"><div><dt class="text-[11px] font-bold uppercase text-[#8291a7]">Proprietário</dt><dd class="mt-1 font-semibold text-[#172b4d]">{{ v.user_name || '-' }}</dd></div><div><dt class="text-[11px] font-bold uppercase text-[#8291a7]">Perfil</dt><dd class="mt-1 font-semibold text-[#172b4d]">{{ v.usage_profile_label }}</dd></div><div><dt class="text-[11px] font-bold uppercase text-[#8291a7]">Registro</dt><dd class="mt-1 font-semibold text-[#172b4d]">{{ v.register_city }} – {{ v.register_state }}</dd></div><div><dt class="text-[11px] font-bold uppercase text-[#8291a7]">Tags</dt><dd class="mt-1 font-semibold text-[#172b4d]">{{ v.tag_purchases?.length ?? 0 }}</dd></div></dl><button @click="handleDelete(v)" class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"><i class="pi pi-trash"></i>Excluir</button></article>
            </div>
            </template>

            <!-- Empty -->
            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-car text-4xl"></i>
                <p>Nenhum veículo encontrado</p>
            </div>

            <!-- Pagination -->
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
