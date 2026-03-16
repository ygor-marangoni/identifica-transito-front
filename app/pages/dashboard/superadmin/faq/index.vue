<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
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
    <div class="space-y-6">
        <HeroSection
            title="FAQ"
            subtitle="Gerencie as perguntas frequentes da plataforma"
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Nova Pergunta"
            buttonLink="/dashboard/superadmin/faq/novo"
            buttonIcon="pi pi-plus"
        />

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-info-circle text-gray-400 text-sm"></i>
                <span class="text-xs text-gray-500">Arraste as linhas para reordenar as perguntas.</span>
            </div>

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

            <div v-else-if="faqs.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-gray-200 bg-gray-50">
                            <th class="py-3 px-2 w-8"></th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Pergunta</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Resposta</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                            <th class="text-left py-3 px-4 text-gray-700 font-semibold">Cadastro</th>
                            <th class="text-right py-3 px-4 text-gray-700 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(faq, index) in faqs"
                            :key="faq.id"
                            draggable="true"
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
                                <div class="flex items-center justify-end gap-1">
                                    <NuxtLink
                                        :to="`/dashboard/superadmin/faq/${faq.id}/editar`"
                                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                        title="Editar"
                                    >
                                        <i class="pi pi-pencil text-sm"></i>
                                    </NuxtLink>
                                    <button
                                        @click="handleDelete(faq)"
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
                <i class="pi pi-question-circle text-4xl"></i>
                <p>Nenhuma FAQ cadastrada</p>
            </div>
        </div>
    </div>
</template>
