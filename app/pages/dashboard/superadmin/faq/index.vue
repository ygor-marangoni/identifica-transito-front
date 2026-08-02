<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import { BadgeCheck, CircleHelp } from '@lucide/vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'FAQ - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();

interface Faq {
    id: number;
    question: string;
    answer: string;
    active: boolean;
    order: number;
    created_at: string;
    updated_at?: string;
}

const faqs = ref<Faq[]>([]);
const loading = ref(false);
const reorderingId = ref<number | null>(null);
const search = ref('');
const sortBy = ref('order');
const filtersOpen = ref(false);
const faqSortOptions = [
    { label: 'Ordem da central', value: 'order' },
    { label: 'Mais recentes', value: 'recent' },
    { label: 'Mais antigas', value: 'oldest' },
    { label: 'Pergunta: A–Z', value: 'question-asc' },
    { label: 'Pergunta: Z–A', value: 'question-desc' },
];

const fetchFaqs = async () => {
    loading.value = true;
    try {
        const res = await $api('/admin/faqs') as any;
        const payload = res?.data ?? res;
        if (Array.isArray(payload)) {
            faqs.value = payload;
        } else if (Array.isArray(payload?.data)) {
            faqs.value = payload.data;
        } else {
            faqs.value = [];
        }
    } catch (e) {
        console.error('Erro ao carregar FAQs:', e);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as FAQs.', life: 5000 });
    } finally {
        loading.value = false;
    }
};

const formatDate = (d: string) => {
    if (!d) return '-';
    if (d.includes('/')) return d.split(' ')[0];
    return new Date(d).toLocaleDateString('pt-BR');
};

const filteredFaqs = computed(() => {
    const term = search.value.trim().toLocaleLowerCase();
    const items = term ? faqs.value.filter((faq) => `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(term)) : [...faqs.value];
    return items.sort((first, second) => {
        if (sortBy.value === 'recent') return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
        if (sortBy.value === 'oldest') return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
        if (sortBy.value === 'question-asc') return first.question.localeCompare(second.question);
        if (sortBy.value === 'question-desc') return second.question.localeCompare(first.question);
        return first.order - second.order;
    });
});
const activeFaqs = computed(() => faqs.value.filter((faq) => faq.active).length);

const handleDelete = (faq: Faq) => {
    confirm.require({
        message: `Tem certeza que deseja excluir a pergunta "${faq.question}"?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-secondary',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await $api(`/admin/faqs/${faq.id}`, { method: 'DELETE' });
                toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'FAQ excluída com sucesso.', life: 3000 });
                fetchFaqs();
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir a FAQ.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        },
    });
};

// Drag and drop reorder
const dragIndex = ref<number | null>(null);

const onDragStart = (index: number) => {
    dragIndex.value = index;
};

const onDragOver = (e: DragEvent) => {
    e.preventDefault();
};

const onDrop = async (targetIndex: number) => {
    if (dragIndex.value === null || dragIndex.value === targetIndex) return;

    const items = [...faqs.value];
    const [moved] = items.splice(dragIndex.value, 1);
    items.splice(targetIndex, 0, moved);
    faqs.value = items;
    dragIndex.value = null;

    // Send new order for the moved item (1-based index = new position)
    reorderingId.value = moved.id;
    try {
        await $api(`/admin/faqs/${moved.id}/reorder`, {
            method: 'PATCH',
            body: { order: targetIndex + 1 },
        });
        toast.add({ severity: 'success', summary: 'Ordem atualizada!', detail: 'A ordem das FAQs foi salva.', life: 2000 });
    } catch (error: any) {
        const msg = error?.data?.message || 'Não foi possível atualizar a ordem.';
        toast.add({ severity: 'error', summary: 'Erro ao reordenar', detail: msg, life: 5000 });
        fetchFaqs();
    } finally {
        reorderingId.value = null;
    }
};

const onDragEnd = () => {
    dragIndex.value = null;
};

onMounted(() => fetchFaqs());
</script>

<template>
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="FAQ"
            subtitle="Mantenha as respostas que orientam clientes durante a jornada."
            greeting="Central de ajuda"
            :showButton="true"
            buttonLabel="Nova Pergunta"
            buttonLink="/dashboard/superadmin/faq/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="admin-orders-page bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="mb-4 flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:justify-between">
                <div>
                    <h2 class="text-[#172b4d]" style="margin:0 0 6px;font-size:25px;font-weight:600;line-height:1.1;">Gerenciamento de perguntas</h2>
                    <p class="text-[#52667f]" style="margin:0;font-size:15px;line-height:1.35;">Organize as respostas que aparecem na central de ajuda.</p>
                </div>
                <div class="flex items-center gap-4 self-start text-xs font-semibold uppercase tracking-wide text-[#52667f] lg:self-end">
                    <span class="inline-flex items-center gap-1.5"><CircleHelp :size="15" class="text-[#1f46ee]" />{{ faqs.length }} perguntas</span>
                    <span class="inline-flex items-center gap-1.5"><BadgeCheck :size="15" class="text-[#16803c]" />{{ activeFaqs }} ativas</span>
                </div>
            </div>

            <button type="button" class="mb-4 flex w-full items-center justify-between border-b border-gray-100 pb-4 text-[15px] font-medium text-[#52667f] md:hidden" @click="filtersOpen = !filtersOpen"><span><i class="pi pi-filter mr-2 text-xs"></i>Filtros</span><i :class="filtersOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-xs"></i></button>
            <div :class="[filtersOpen ? 'max-h-[14rem] mb-6 border-b border-gray-100 pb-5 opacity-100' : 'max-h-0 overflow-hidden opacity-0 pointer-events-none', 'admin-orders-filters grid gap-3 transition-[max-height,opacity,margin,padding] duration-300 md:max-h-none md:overflow-visible md:pointer-events-auto md:mb-6 md:border-b md:border-gray-100 md:pb-5 md:opacity-100 md:grid-cols-2 xl:grid-cols-[minmax(25rem,1.45fr)_minmax(18rem,1fr)] xl:items-center']">
                <div class="relative"><i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i><input v-model="search" type="search" placeholder="Buscar por pergunta ou resposta..." class="admin-orders-search h-12 w-full rounded-lg border border-gray-300 pl-9 pr-4 text-sm focus:outline-none" /></div>
                <SelectInput v-model="sortBy" :options="faqSortOptions" show-icon icon="pi pi-sort-alt" :icon-offset-y="2" wrapper-class="admin-orders-filter-select" select-class="!h-12 !bg-[#fafafa]" list-class="admin-orders-sort-panel" />
            </div>
            <div class="mb-4 flex items-center gap-2 text-sm text-[#64748b]"><i class="pi pi-info-circle"></i><span>Arraste as linhas no desktop para reordenar as perguntas.</span></div>

            <div v-if="loading" class="space-y-3">
                <div v-for="n in 6" :key="n" class="flex gap-4 items-center p-3">
                    <Skeleton width="3%" height="14px" />
                    <Skeleton width="5%" height="14px" />
                    <Skeleton width="35%" height="14px" />
                    <Skeleton width="30%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="10%" height="14px" />
                    <Skeleton width="8%" height="28px" />
                </div>
            </div>

            <template v-else-if="filteredFaqs.length > 0">
            <div class="admin-orders-table hidden overflow-x-auto rounded-xl border border-[#e8edf5] md:block">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="py-3 px-2 w-8"></th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Pergunta</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Resposta</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-center py-3 px-4 !text-[12px] text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(faq, index) in filteredFaqs"
                            :key="faq.id"
                            :draggable="sortBy === 'order' && !search"
                            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-grab active:cursor-grabbing"
                            :class="{ 'opacity-50': reorderingId === faq.id, 'bg-blue-50': dragIndex === index }"
                            @dragstart="onDragStart(index)"
                            @dragover="onDragOver"
                            @drop="onDrop(index)"
                            @dragend="onDragEnd"
                        >
                            <td class="py-3 px-2 text-gray-300">
                                <i class="pi pi-bars text-xs"></i>
                            </td>
                            <td class="py-3 px-4 font-medium text-gray-900 max-w-72 truncate">{{ faq.question }}</td>
                            <td class="py-3 px-4 text-gray-600 max-w-80 truncate">{{ faq.answer }}</td>
                            <td class="py-3 px-4">
                                <span
                                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                                    :class="faq.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
                                >
                                    {{ faq.active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-gray-500">{{ formatDate(faq.created_at) }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center justify-center gap-2">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/faq/${faq.id}/editar`"
                                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8dee8] bg-white text-[#64748b] transition hover:border-[#b9c7ff] hover:bg-[#eef2ff] hover:text-[#1f46ee]"
                                        title="Editar"
                                        aria-label="Editar pergunta"
                                    >
                                        <i class="pi pi-pen-to-square text-sm"></i>
                                    </NuxtLink>
                                    <button
                                        @click="handleDelete(faq)"
                                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:border-red-300 hover:bg-red-50"
                                        title="Excluir"
                                        aria-label="Excluir pergunta"
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
                <article v-for="faq in filteredFaqs" :key="faq.id" class="rounded-2xl border border-[#e4eaf2] bg-white p-4">
                    <header class="flex items-start gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-question-circle"></i></span><div class="min-w-0 flex-1"><p class="mb-0 text-sm font-bold text-[#172b4d]">{{ faq.question }}</p><p class="mt-1 mb-0 line-clamp-2 text-xs text-[#52667f]">{{ faq.answer }}</p></div><span :class="faq.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'" class="shrink-0 rounded-full px-2 py-1 text-xs font-medium">{{ faq.active ? 'Ativa' : 'Inativa' }}</span></header>
                    <div class="mt-4 flex items-center justify-between border-t border-[#edf1f6] pt-3"><span class="text-xs text-[#64748b]">Cadastro: {{ formatDate(faq.created_at) }}</span><div class="flex gap-2"><NuxtLink :to="`/dashboard/superadmin/faq/${faq.id}/editar`" class="inline-flex items-center gap-1 rounded-lg border border-[#d8dee8] px-3 py-2 text-xs font-semibold text-[#52667f] hover:bg-[#eef2ff] hover:text-[#1f46ee]"><i class="pi pi-pen-to-square"></i>Editar</NuxtLink><button @click="handleDelete(faq)" class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"><i class="pi pi-trash"></i>Excluir</button></div></div>
                </article>
            </div>
            </template>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <i class="pi pi-question-circle text-4xl"></i>
                <p>Nenhuma FAQ cadastrada</p>
            </div>
        </div>
    </div>
</template>
