<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import PaginationControls from '~/components/PaginationControls.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Etiquetas - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();

interface Tag {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color_name: string | null;
    price: string;
    created_at: string;
}

const tags = ref<Tag[]>([]);
const loading = ref(false);
const search = ref('');
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 });

const fetchTags = async (page = 1) => {
    loading.value = true;
    try {
        const params = new URLSearchParams({ page: String(page), per_page: '15' });
        if (search.value) params.set('q', search.value);
        const res = await $api(`/admin/tags?${params}`) as any;
        tags.value = Array.isArray(res?.data) ? res.data : [];
        pagination.value.currentPage = Number(res?.meta?.current_page ?? page);
        pagination.value.lastPage = Number(res?.meta?.last_page ?? 1);
        pagination.value.total = Number(res?.meta?.total ?? tags.value.length);
    } catch (e) {
        console.error('Erro ao carregar etiquetas:', e);
    } finally {
        loading.value = false;
    }
};

const goToPage = (page: number) => {
    if (page < 1 || page > pagination.value.lastPage || page === pagination.value.currentPage || loading.value) return;
    fetchTags(page);
};

const onSearch = () => {
    pagination.value.currentPage = 1;
    fetchTags(1);
};

const formatDate = (d: string) => {
    if (!d) return '-';
    if (d.includes('/')) return d.split(' ')[0];
    return new Date(d).toLocaleDateString('pt-BR');
};

const formatCurrency = (v: string | number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));

const handleDelete = (tag: Tag) => {
    confirm.require({
        message: `Tem certeza que deseja excluir a etiqueta "${tag.name}"?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await $api(`/admin/tags/${tag.id}`, { method: 'DELETE' });
                toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'Etiqueta excluída com sucesso.', life: 3000 });
                fetchTags(pagination.value.currentPage);
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir a etiqueta.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        },
    });
};

onMounted(() => fetchTags());
</script>

<template>
    <div class="space-y-6">
        <HeroSection
            title="Etiquetas"
            subtitle="Gerencie as etiquetas disponíveis na plataforma"
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Nova Etiqueta"
            buttonLink="/dashboard/superadmin/etiquetas/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <!-- Search -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="relative flex-1 min-w-[240px]">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar por nome ou cor..."
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
                <span class="text-sm text-gray-500 ml-auto">{{ pagination.total }} etiqueta(s)</span>
            </div>

            <!-- Skeleton -->
            <div v-if="loading" class="space-y-3">
                <div v-for="n in 8" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="4%" height="14px" />
                    <Skeleton width="20%" height="14px" />
                    <Skeleton width="14%" height="20px" />
                    <Skeleton width="30%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="8%" height="28px" />
                </div>
            </div>

            <!-- Table -->
            <div v-else-if="tags.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">#</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Nome</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cor</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Descrição</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Preço</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-right py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(t, index) in tags"
                            :key="t.id"
                            class="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <td class="py-3 px-4 text-gray-400 text-xs">{{ (index + 1) + (pagination.currentPage - 1) * 15 }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ t.name }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-2">
                                    <img
                                        v-if="t.color_name"
                                        :src="`/images/dashboard/etiquetas/${t.color_name}.svg`"
                                        :alt="t.color_name"
                                        class="w-7 h-7 object-contain"
                                    />
                                    <span class="capitalize text-gray-600">{{ t.color_name || '-' }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-gray-500 max-w-xs truncate">{{ t.description || '-' }}</td>
                            <td class="py-3 px-4 font-medium text-gray-900">{{ formatCurrency(t.price) }}</td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(t.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-end gap-1">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/etiquetas/${t.id}/editar`"
                                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                        title="Editar"
                                    >
                                        <i class="pi pi-pencil text-sm"></i>
                                    </NuxtLink>
                                    <button
                                        @click="handleDelete(t)"
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

            <!-- Empty -->
            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-tag text-4xl"></i>
                <p>Nenhuma etiqueta encontrada</p>
            </div>

            <!-- Pagination -->
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
