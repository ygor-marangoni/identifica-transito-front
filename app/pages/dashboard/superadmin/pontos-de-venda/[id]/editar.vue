<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Editar Ponto de Venda - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const route = useRoute();
const pickupPointId = Number(route.params.id);

const loading = ref(false);
const loadingPoint = ref(false);

const form = ref({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    responsible: '',
    map_link: '',
    active: true,
});

const fetchPickupPoint = async () => {
    loadingPoint.value = true;
    try {
        const res = await $api(`/admin/pickup-points/${pickupPointId}`) as any;
        const point = res?.data ?? res;

        form.value.name = point?.name ?? '';
        form.value.cnpj = point?.cnpj ?? '';
        form.value.address = point?.address ?? '';
        form.value.phone = point?.phone ?? '';
        form.value.responsible = point?.responsible ?? '';
        form.value.map_link = point?.map_link ?? '';
        form.value.active = Boolean(point?.active);
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do ponto de venda.', life: 5000 });
        navigateTo('/dashboard/superadmin/pontos-de-venda');
    } finally {
        loadingPoint.value = false;
    }
};

onMounted(() => fetchPickupPoint());

const handleSubmit = async () => {
    if (!form.value.name) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha o nome do ponto de venda.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api(`/admin/pickup-points/${pickupPointId}`, {
            method: 'PUT',
            body: {
                name: form.value.name,
                cnpj: form.value.cnpj || null,
                address: form.value.address || null,
                phone: form.value.phone || null,
                responsible: form.value.responsible || null,
                map_link: form.value.map_link || null,
                active: form.value.active,
            },
        });
        toast.add({ severity: 'success', summary: 'Ponto atualizado!', detail: 'Os dados foram salvos com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/pontos-de-venda');
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
            title="Editar Ponto de Venda"
            subtitle="Atualize as informações do ponto de venda."
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Voltar para Pontos de Venda"
            buttonLink="/dashboard/superadmin/pontos-de-venda"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div v-if="loadingPoint" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
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
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Editar Ponto de Venda</h1>
                    <p class="text-gray-600">Atualize os campos desejados.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Informações do Ponto</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.name"
                                id="name"
                                label="Nome *"
                                placeholder="Ex: Posto Shell Centro"
                                showIcon
                                icon="pi pi-shop"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                            <FormInputText
                                v-model="form.cnpj"
                                id="cnpj"
                                label="CNPJ"
                                placeholder="00.000.000/0000-00"
                                mask="99.999.999/9999-99"
                                showIcon
                                icon="pi pi-id-card"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <FormInputText
                            v-model="form.address"
                            id="address"
                            label="Endereço"
                            placeholder="Ex: Avenida Martins de Sá"
                            showIcon
                            icon="pi pi-map-marker"
                            wrapper-class="w-full"
                            inputClass="w-full"
                            :disabled="loading"
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.phone"
                                id="phone"
                                label="Telefone"
                                placeholder="(00) 00000-0000"
                                mask="(99) 99999-9999"
                                showIcon
                                icon="pi pi-phone"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                            <FormInputText
                                v-model="form.responsible"
                                id="responsible"
                                label="Responsável"
                                placeholder="Ex: Frentista Rubens"
                                showIcon
                                icon="pi pi-user"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <FormInputText
                            v-model="form.map_link"
                            id="map_link"
                            type="url"
                            label="Link do Mapa"
                            placeholder="https://maps.google.com/..."
                            showIcon
                            icon="pi pi-map"
                            wrapper-class="w-full"
                            inputClass="w-full"
                            :disabled="loading"
                        />

                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                v-model="form.active"
                                type="checkbox"
                                class="rounded border-gray-300 text-it-primary focus:ring-it-primary"
                                :disabled="loading"
                            />
                            Ponto ativo
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
