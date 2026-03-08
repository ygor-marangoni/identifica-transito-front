<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';

definePageMeta({ layout: 'dashboard' });

useHead({ title: 'Pontos de Venda - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();

interface PickupPoint {
    id: number;
    name: string;
    cnpj: string;
    phone: string;
    responsible?: string | null;
    responsable?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    map_link?: string | null;
    active?: number | boolean;
    created_at: string;
}

const points = ref<PickupPoint[]>([]);
const loading = ref(false);
const search = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const fetchPoints = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('search', search.value);
        const res = await $api(`/admin/pickup-points?${params}`) as any;
        const payload = res?.data ?? res;
        points.value = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        currentPage.value = payload?.current_page ?? page;
        lastPage.value = payload?.last_page ?? 1;
        total.value = payload?.total ?? points.value.length;
    } catch (e) {
        console.error('Erro ao carregar pontos de venda:', e);
    } finally {
        loading.value = false;
    }
};

const onSearch = () => { currentPage.value = 1; fetchPoints(1); };
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const formatCnpj = (cnpj: string) => {
    if (!cnpj) return '-';
    const c = cnpj.replace(/\D/g, '');
    return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

onMounted(() => fetchPoints());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Pontos de Venda"
            subtitle="Gerencie os pontos de retirada e venda da plataforma"
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
                        placeholder="Buscar por nome, CNPJ ou cidade..."
                        class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="onSearch"
                    />
                </div>
                <button @click="onSearch" class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Buscar
                </button>
                <span class="text-sm text-gray-500 ml-auto">{{ total }} ponto(s)</span>
            </div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="8%" height="14px" />
                </div>
            </div>

            <div v-else-if="points.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Nome</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">CNPJ</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Telefone</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Responsável</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Endereço</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in points" :key="p.id" class="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td class="py-3 px-4 text-gray-400">{{ p.id }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ p.name }}</td>
                            <td class="py-3 px-4 font-mono text-gray-600 text-xs">{{ formatCnpj(p.cnpj) }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ p.phone || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ p.responsible || p.responsable || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                                {{ [p.address, p.city, p.state].filter(Boolean).join(', ') || '-' }}
                            </td>
                            <td class="py-3 px-4">
                                <span
                                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="p.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
                                >
                                    {{ p.active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(p.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-map-marker text-4xl"></i>
                <p>Nenhum ponto de venda encontrado</p>
            </div>

            <div v-if="lastPage > 1" class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <button :disabled="currentPage === 1" @click="fetchPoints(currentPage - 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    <i class="pi pi-chevron-left text-xs"></i> Anterior
                </button>
                <span class="text-sm text-gray-500">Página {{ currentPage }} de {{ lastPage }}</span>
                <button :disabled="currentPage === lastPage" @click="fetchPoints(currentPage + 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    Próxima <i class="pi pi-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    </div>
</template>
