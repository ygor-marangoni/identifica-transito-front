<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Editar FAQ - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const route = useRoute();
const faqId = Number(route.params.id);

const loading = ref(false);
const loadingFaq = ref(false);

const form = ref({
    question: '',
    answer: '',
    active: true,
});

const fetchFaq = async () => {
    loadingFaq.value = true;
    try {
        const res = await $api(`/admin/faqs/${faqId}`) as any;
        const faq = res?.data ?? res;

        form.value.question = faq?.question ?? '';
        form.value.answer = faq?.answer ?? '';
        form.value.active = Boolean(faq?.active);
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados da FAQ.', life: 5000 });
        navigateTo('/dashboard/superadmin/faq');
    } finally {
        loadingFaq.value = false;
    }
};

onMounted(() => fetchFaq());

const handleSubmit = async () => {
    if (!form.value.question) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha a pergunta.', life: 3000 });
        return;
    }
    if (!form.value.answer) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha a resposta.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api(`/admin/faqs/${faqId}`, {
            method: 'PUT',
            body: {
                question: form.value.question,
                answer: form.value.answer,
                active: form.value.active,
            },
        });
        toast.add({ severity: 'success', summary: 'FAQ atualizada!', detail: 'Os dados foram salvos com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/faq');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível salvar as alterações.';
        toast.add({ severity: 'error', summary: 'Erro ao salvar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-10">
        <HeroSection
            title="Editar FAQ"
            subtitle="Atualize as informações da pergunta frequente."
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Voltar para FAQ"
            buttonLink="/dashboard/superadmin/faq"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div v-if="loadingFaq" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                <Skeleton width="45%" height="2rem" class="mb-4" />
                <Skeleton height="60px" />
                <Skeleton height="120px" />
                <div class="grid grid-cols-2 gap-6">
                    <Skeleton height="60px" />
                    <Skeleton height="30px" />
                </div>
            </div>

            <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Editar FAQ</h1>
                    <p class="text-gray-600">Atualize os campos desejados.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Conteúdo da FAQ</h2>

                        <FormInputText
                            v-model="form.question"
                            id="question"
                            label="Pergunta *"
                            placeholder="Ex: Como faço para cadastrar meu veículo?"
                            showIcon
                            icon="pi pi-question-circle"
                            wrapper-class="w-full"
                            inputClass="w-full"
                            :disabled="loading"
                        />

                        <div class="flex flex-col gap-1.5">
                            <label for="answer" class="text-sm font-medium text-gray-700">Resposta *</label>
                            <textarea
                                id="answer"
                                v-model="form.answer"
                                placeholder="Ex: Para cadastrar seu veículo, acesse..."
                                rows="5"
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:opacity-60"
                                :disabled="loading"
                            ></textarea>
                        </div>

                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    v-model="form.active"
                                    type="checkbox"
                                    class="rounded border-gray-300 text-it-primary focus:ring-it-primary"
                                    :disabled="loading"
                                />
                                FAQ ativa
                        </label>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Salvar Alterações
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>
