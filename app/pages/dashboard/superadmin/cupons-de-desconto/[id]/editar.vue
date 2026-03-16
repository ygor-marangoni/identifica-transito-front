<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Editar Cupom de Desconto - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const route = useRoute();
const couponId = Number(route.params.id);

const loading = ref(false);
const loadingCoupon = ref(false);

const typeOptions = [
    { label: 'Percentual (%)', value: 1 },
    { label: 'Valor Fixo (R$)', value: 2 },
];

const form = ref({
    code: '',
    type: 1,
    value: '',
    qty: '0',
    expiration_date: '',
});

const toInputDateTime = (value: string | null) => {
    if (!value) return '';
    const normalized = value.replace(' ', 'T');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized)) {
        return normalized.slice(0, 16);
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hour = String(parsed.getHours()).padStart(2, '0');
    const minute = String(parsed.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
};

const normalizeDateTime = (value: string) => {
    if (!value) return null;
    return `${value.replace('T', ' ')}:00`;
};

const fetchCoupon = async () => {
    loadingCoupon.value = true;
    try {
        const res = await $api(`/admin/discount-coupons/${couponId}`) as any;
        const coupon = res?.data ?? res;

        form.value.code = coupon?.code ?? '';
        form.value.type = Number(coupon?.type ?? 1);
        form.value.value = String(coupon?.value ?? '');
        form.value.qty = String(coupon?.qty ?? 0);
        form.value.expiration_date = toInputDateTime(coupon?.expiration_date ?? null);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do cupom.', life: 5000 });
        navigateTo('/dashboard/superadmin/cupons-de-desconto');
    } finally {
        loadingCoupon.value = false;
    }
};

onMounted(() => fetchCoupon());

const handleSubmit = async () => {
    if (!form.value.code || !form.value.value) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha o código e o valor do cupom.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api(`/admin/discount-coupons/${couponId}`, {
            method: 'PUT',
            body: {
                code: form.value.code.trim(),
                type: Number(form.value.type),
                value: Number(form.value.value),
                qty: Number(form.value.qty || 0),
                expiration_date: normalizeDateTime(form.value.expiration_date),
            },
        });

        toast.add({ severity: 'success', summary: 'Cupom atualizado!', detail: 'Os dados foram salvos com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/cupons-de-desconto');
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
            title="Editar Cupom de Desconto"
            subtitle="Atualize as informações do cupom selecionado."
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Voltar para Cupons"
            buttonLink="/dashboard/superadmin/cupons-de-desconto"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div v-if="loadingCoupon" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                <Skeleton width="45%" height="2rem" class="mb-4" />
                <div class="grid grid-cols-2 gap-6">
                    <Skeleton height="60px" />
                    <Skeleton height="60px" />
                    <Skeleton height="60px" />
                    <Skeleton height="60px" />
                </div>
                <Skeleton height="60px" />
            </div>

            <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Editar Cupom de Desconto</h1>
                    <p class="text-gray-600">Atualize os campos desejados.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Informações do Cupom</h2>

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
                                class="w-full h-15 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium bg-white"
                                :disabled="loading"
                            />
                            <p class="text-xs text-gray-500 mt-2">Deixe em branco para cupom sem data limite.</p>
                        </div>
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
