<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';

definePageMeta({ layout: 'dashboard' });

useHead({ title: 'Veículos - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();

interface Vehicle {
    id: number;
    name: string;
    plate: string;
    brand?: string;
    model?: string;
    year?: string | number;
    user?: { name: string; email: string } | null;
    created_at: string;
}

const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const search = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const fetchVehicles = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('search', search.value);
        const res = await $api(`/admin/vehicles?${params}`) as any;
        const payload = res?.data ?? res;
        vehicles.value = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        currentPage.value = payload?.current_page ?? page;
        lastPage.value = payload?.last_page ?? 1;
        total.value = payload?.total ?? vehicles.value.length;
    } catch (e) {
        console.error('Erro ao carregar veículos:', e);
    } finally {
        loading.value = false;
    }
};

const onSearch = () => { currentPage.value = 1; fetchVehicles(1); };
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

onMounted(() => fetchVehicles());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Veículos"
            subtitle="Todos os automóveis cadastrados na plataforma"
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
                        placeholder="Buscar por placa, nome ou proprietário..."
                        class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="onSearch"
                    />
                </div>
                <button @click="onSearch" class="px-4 py-2 bg-it-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Buscar
                </button>
                <span class="text-sm text-gray-500 ml-auto">{{ total }} veículo(s)</span>
            </div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="25%" height="14px" />
                    <Skeleton width="30%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                </div>
            </div>

            <div v-else-if="vehicles.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Nome</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Placa</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Marca / Modelo</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Proprietário</th>
                            <th class="text-left py-3 px-4 text-gray-500 font-medium">Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in vehicles" :key="v.id" class="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td class="py-3 px-4 text-gray-400">{{ v.id }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ v.name }}</td>
                            <td class="py-3 px-4">
                                <span class="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">{{ v.plate }}</span>
                            </td>
                            <td class="py-3 px-4 text-gray-600">{{ [v.brand, v.model].filter(Boolean).join(' / ') || '-' }}</td>
                            <td class="py-3 px-4 text-gray-600">{{ v.user?.name || '-' }}</td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(v.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-car text-4xl"></i>
                <p>Nenhum veículo encontrado</p>
            </div>

            <div v-if="lastPage > 1" class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <button :disabled="currentPage === 1" @click="fetchVehicles(currentPage - 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    <i class="pi pi-chevron-left text-xs"></i> Anterior
                </button>
                <span class="text-sm text-gray-500">Página {{ currentPage }} de {{ lastPage }}</span>
                <button :disabled="currentPage === lastPage" @click="fetchVehicles(currentPage + 1)" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                    Próxima <i class="pi pi-chevron-right text-xs"></i>
                </button>
            </div>
        </div>
    </div>
</template>
