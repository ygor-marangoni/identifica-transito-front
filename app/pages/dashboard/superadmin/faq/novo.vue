<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';
import InputSwitch from 'primevue/inputswitch';

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
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Nova FAQ"
            subtitle="Inclua uma nova resposta para ajudar os clientes com mais agilidade."
            greeting="Central de ajuda"
            :showButton="true"
            buttonLabel="Voltar para FAQ"
            buttonLink="/dashboard/superadmin/faq"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="w-full">
            <div class="admin-user-form-shell faq-form-shell bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar FAQ</h1>
                    <p class="text-gray-600">Preencha as informações para criar uma nova pergunta frequente.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="admin-user-form-grid space-y-8">
                    <div class="space-y-5">
                        <h2 class="flex items-center gap-3 text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3"><span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-question-circle"></i></span>Conteúdo da FAQ</h2>

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
                                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-y disabled:opacity-60"
                                :disabled="loading"
                            ></textarea>
                        </div>

                    </div>

                    <div class="space-y-5">
                        <h2 class="flex items-center gap-3 text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3"><span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-verified"></i></span>Visibilidade</h2>
                        <p class="text-sm text-gray-500">Defina se esta pergunta ficará disponível para consulta na central de ajuda.</p>

                        <div class="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
                            <div>
                                <strong class="block text-[14px] font-semibold text-gray-900 md:text-[14.5px]">FAQ ativa</strong>
                                <small class="text-gray-500">Exibir esta pergunta para os clientes.</small>
                            </div>
                            <InputSwitch v-model="form.active" :disabled="loading" />
                        </div>
                    </div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Cadastrar FAQ
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:global(.layout-admin .admin-page .faq-form-shell.faq-form-shell input:not([type='checkbox']):not([type='radio']):focus),
:global(.layout-admin .admin-page .faq-form-shell.faq-form-shell textarea:focus) {
    border: 1px solid #64748b !important;
    outline: none !important;
    box-shadow: none !important;
}
</style>
