<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Nova FAQ - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const form = ref({
    question: '',
    answer: '',
    active: true,
});

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
        await $api('/admin/faqs', {
            method: 'POST',
            body: {
                question: form.value.question,
                answer: form.value.answer,
                active: form.value.active,
            },
        });
        toast.add({ severity: 'success', summary: 'FAQ criada!', detail: 'A pergunta foi cadastrada com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/faq');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível cadastrar a FAQ.';
        toast.add({ severity: 'error', summary: 'Erro ao cadastrar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-10">
        <HeroSection
            title="Nova FAQ"
            subtitle="Cadastre uma nova pergunta frequente."
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Voltar para FAQ"
            buttonLink="/dashboard/superadmin/faq"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar FAQ</h1>
                    <p class="text-gray-600">Preencha as informações para criar uma nova pergunta frequente.</p>
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
                        Cadastrar FAQ
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>
