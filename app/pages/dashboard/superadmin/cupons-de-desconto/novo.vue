<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Novo Cupom de Desconto - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const typeOptions = [
    { label: 'Percentual (%)', value: 1 },
    { label: 'Valor Fixo (R$)', value: 2 },
];

const form = ref({
    code: '',
    type: 1,
    value: '',
    qty: '',
    expiration_date: '',
});

const normalizeDateTime = (value: string) => {
    if (!value) return null;
    return `${value.replace('T', ' ')}:00`;
};

const handleSubmit = async () => {
    if (!form.value.code || !form.value.value) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha o código e o valor do cupom.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api('/admin/discount-coupons', {
            method: 'POST',
            body: {
                code: form.value.code.trim(),
                type: Number(form.value.type),
                value: Number(form.value.value),
                qty: form.value.qty === '' ? null : Number(form.value.qty),
                expiration_date: normalizeDateTime(form.value.expiration_date),
            },
        });

        toast.add({ severity: 'success', summary: 'Cupom criado!', detail: 'O cupom de desconto foi cadastrado com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/cupons-de-desconto');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível cadastrar o cupom.';
        toast.add({ severity: 'error', summary: 'Erro ao cadastrar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Novo Cupom de Desconto"
            subtitle="Configure uma nova campanha de desconto para os seus clientes."
            greeting="Nova campanha"
            :showButton="true"
            buttonLabel="Voltar para Cupons"
            buttonLink="/dashboard/superadmin/cupons-de-desconto"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="w-full">
            <div class="admin-user-form-shell catalog-form-shell bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar Cupom de Desconto</h1>
                    <p class="text-gray-600">Preencha as informações para criar um novo cupom.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="admin-user-form-grid space-y-8">
                    <div class="space-y-5 col-span-full">
                        <h2 class="flex items-center gap-3 text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3"><span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-ticket"></i></span>Informações do Cupom</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.code"
                                id="code"
                                label="Código *"
                                placeholder="Ex: CUPOM10"
                                showIcon
                                icon="pi pi-ticket"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />

                            <SelectInput
                                v-model="form.type"
                                id="type"
                                label="Tipo *"
                                :options="typeOptions"
                                placeholder="Selecione o tipo"
                                showIcon
                                icon="pi pi-percentage"
                                wrapperClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.value"
                                id="value"
                                type="number"
                                label="Valor *"
                                placeholder="Ex: 10"
                                showIcon
                                :icon="form.type === 2 ? 'pi pi-money-bill' : 'pi pi-percentage'"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />

                            <FormInputText
                                v-model="form.qty"
                                id="qty"
                                type="number"
                                label="Quantidade de Uso"
                                placeholder="0"
                                showIcon
                                icon="pi pi-hashtag"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <div class="w-full">
                            <label for="expiration_date" class="block text-sm font-semibold text-gray-900 mb-2">Data de Expiração</label>
                            <input
                                id="expiration_date"
                                v-model="form.expiration_date"
                                type="datetime-local"
                                class="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-gray-700"
                                :disabled="loading"
                            />
                            <p class="text-xs text-gray-500 mt-2">Deixe em branco para cupom sem data limite.</p>
                        </div>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Cadastrar Cupom
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell input:not([type='checkbox']):not([type='radio']):focus),
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell textarea:focus),
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell .p-select:focus-within) {
    border: 1px solid #64748b !important;
    outline: none !important;
    box-shadow: none !important;
}

:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell input:not([type='checkbox']):not([type='radio'])),
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell .p-select) {
    height: 48px !important;
    min-height: 48px !important;
}

@media (max-width: 639px) {
    :global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell input:not([type='checkbox']):not([type='radio'])),
    :global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell .p-select) {
        height: 52px !important;
        min-height: 52px !important;
    }
}

</style>
