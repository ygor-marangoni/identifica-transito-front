<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import PaginationControls from '~/components/PaginationControls.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });

useHead({ title: 'Pontos de Venda - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();

interface PickupPoint {
    id: number;
    name: string;
    cnpj: string | null;
    address: string | null;
    phone: string | null;
    responsible: string | null;
    map_link?: string | null;
    active: number | boolean;
    created_at: string;
    updated_at?: string | null;
    deleted_at?: string | null;
}

const points = ref<PickupPoint[]>([]);
const loading = ref(false);
const search = ref('');
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 });

const fetchPoints = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('q', search.value);

        const res = await $api(`/admin/pickup-points?${params}`) as any;
        const payload = res?.data ?? res;
        const meta = res?.meta ?? payload?.meta ?? {};

        if (Array.isArray(payload)) {
            points.value = payload;
        } else if (Array.isArray(payload?.data)) {
            points.value = payload.data;
        } else {
            points.value = [];
        }

        pagination.value.currentPage = Number(meta?.current_page ?? payload?.current_page ?? page);
        pagination.value.lastPage = Number(meta?.last_page ?? payload?.last_page ?? 1);
        pagination.value.total = Number(meta?.total ?? payload?.total ?? points.value.length);
    } catch (e) {
        console.error('Erro ao carregar pontos de venda:', e);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page: number) => {
    if (page < 1 || page > pagination.value.lastPage || page === pagination.value.currentPage || loading.value) return;
    fetchPoints(page);
};

const onSearch = () => {
    pagination.value.currentPage = 1;
    fetchPoints(1);
};

const formatDate = (d: string) => {
    if (!d) return '-';
    if (d.includes('/')) return d.split(' ')[0];
    return new Date(d).toLocaleDateString('pt-BR');
};

const formatCnpj = (cnpj: string | null) => {
    if (!cnpj) return '-';
    const c = cnpj.replace(/\D/g, '');
    return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const handleDelete = (point: PickupPoint) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o ponto de venda "${point.name}"?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await $api(`/admin/pickup-points/${point.id}`, { method: 'DELETE' });
                toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'Ponto de venda excluído com sucesso.', life: 3000 });
                fetchPoints(pagination.value.currentPage);
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir o ponto de venda.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        },
    });
};

onMounted(() => fetchPoints());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Pontos de Venda"
            subtitle="Gerencie os pontos de retirada e venda da plataforma"
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Novo Ponto de Venda"
            buttonLink="/dashboard/superadmin/pontos-de-venda/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="relative flex-1 min-w-60">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por nome, CNPJ ou cidade..."
                        class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="onSearch"
                    />
                </div>
                <button @click="onSearch" class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Buscar
                </button>
                <span class="text-sm text-gray-500 ml-auto">{{ pagination.total }} ponto(s)</span>
            </div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="4%" height="14px" />
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="15%" height="14px" />
                    <Skeleton width="15%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="8%" height="28px" />
                </div>
            </div>

            <div v-else-if="points.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">#</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Nome</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">CNPJ</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Endereço</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Telefone</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Responsável</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-right py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in points" :key="p.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td class="py-3 px-4 text-gray-400 text-xs">{{ (index + 1) + (pagination.currentPage - 1) * 15 }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ p.name }}</td>
                            <td class="py-3 px-4 font-mono text-gray-600 text-xs">{{ formatCnpj(p.cnpj) }}</td>
                            <td class="py-3 px-4 text-gray-600 max-w-55 truncate">{{ p.address || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ p.phone || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ p.responsible || '-' }}</td>
                            <td class="py-3 px-4">
                                <span
                                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="p.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
                                >
                                    {{ p.active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(p.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-end gap-1">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/pontos-de-venda/${p.id}/editar`"
                                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                        title="Editar"
                                    >
                                        <i class="pi pi-pencil text-sm"></i>
                                    </NuxtLink>
                                    <button
                                        @click="handleDelete(p)"
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
                <i class="pi pi-map-marker text-4xl"></i>
                <p>Nenhum ponto de venda encontrado</p>
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
