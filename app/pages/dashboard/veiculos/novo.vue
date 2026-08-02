<script setup lang="ts">
import { ref, watch } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import VehicleForm from '~/components/forms/VehicleForm.vue';
import { useToast } from 'primevue/usetoast';
import { createEmptyFormData } from '~/utils/vehicleFormData';
import { normalizePlate } from '~/utils/plate';
import { formatBirthDate } from '~/utils/date';
import { USAGE_PROFILE } from '~/utils/vehicleEnums';

definePageMeta({
    layout: 'dashboard'
});

const formData = ref(createEmptyFormData());
const pageTitle = 'Cadastrar Novo Veículo';

useHead({
    title: `${pageTitle} - Identifica Trânsito`,
    meta: [
        {
            name: 'description',
            content: 'Cadastre seu veículo e gere sua etiqueta de identificação.'
        }
    ]
});

const loading = ref(false);
const toast = useToast();
const municipios = ref<Array<{ label: string; value: string }>>([]);
const municipiosLoading = ref(false);

// Buscar municípios da API IBGE
const fetchMunicipios = async (uf: string, preserveSelection = false) => {
    if (!uf) {
        municipios.value = [];
        if (!preserveSelection) {
            formData.value.cidadeRegistro = '';
        }
        return;
    }

    municipiosLoading.value = true;
    try {
        const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        );
        const data = await response.json();
        
        municipios.value = data.map((municipio: any) => ({
            label: municipio.nome,
            value: municipio.nome
        })).sort((a: any, b: any) => a.label.localeCompare(b.label));
        
        if (!preserveSelection) {
            formData.value.cidadeRegistro = '';
        }
    } catch (error) {
        console.error('Erro ao buscar municípios:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar as cidades.',
            life: 3000
        });
        municipios.value = [];
    } finally {
        municipiosLoading.value = false;
    }
};

// Watchers para monitorar mudanças no estado
watch(() => formData.value.estadoRegistro, (newUF) => {
    if (newUF) {
        fetchMunicipios(newUF);
    }
});

const handleSubmit = async () => {
    loading.value = true;

    try {
        const { $api } = useNuxtApp();
        const payload: Record<string, unknown> = {
            plate: normalizePlate(formData.value.placa),
            type: Number(formData.value.tipoVeiculo),
            register_state: formData.value.estadoRegistro,
            register_city: formData.value.cidadeRegistro,
            usage_profile: Number(formData.value.perfilUso)
        };

        if (Number(formData.value.perfilUso) === USAGE_PROFILE.RECEM_NASCIDO) {
            payload.usage_profile_baby_date_of_birth = formatBirthDate(formData.value.babyDateOfBirth);
        }

        const response = await $api('/vehicles', { method: 'POST', body: payload });
        const vehicle = (response as any)?.data || response;

        toast.add({
            severity: 'success',
            summary: 'Veículo cadastrado!',
            detail: 'Seu veículo foi cadastrado com sucesso, compre agora sua etiqueta.',
            life: 3000
        });

        // Resetar formulário
        formData.value = createEmptyFormData();

        const vehicleId = vehicle?.id;
        if (vehicleId) {
            navigateTo(`/dashboard/veiculos/detalhes/${vehicleId}`);
        }
    } catch (error: any) {
        const apiMessage = error?.data?.message || error?.data?.error;
        const errorMsg = apiMessage || error?.message || 'Não foi possível salvar o veículo.';
        toast.add({
            severity: 'error',
            summary: 'Erro ao salvar',
            detail: errorMsg,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6 md:space-y-7">
        <!-- Hero -->
        <HeroSection
            title="Cadastrar veículo"
            subtitle="Informe os dados do seu veículo para gerar a etiqueta Identifica Trânsito."
            :showButton="true"
            buttonLabel="Voltar para Meus Veículos"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-arrow-left"
        />
        <div class="w-full">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
                <div class="mb-5 pb-0">
                    <h1 class="text-2xl! font-bold text-[#172b4d] mb-2 sm:text-3xl!">Preencha o formulário</h1>
                    <p class="text-slate-600 mb-0!">
                        Cadastre os dados do veículo para emitir sua etiqueta de identificação.
                    </p>
                </div>

                <VehicleForm
                    :formData="formData"
                    :municipios="municipios"
                    :municipiosLoading="municipiosLoading"
                    :loading="loading"
                    buttonLabel="Cadastrar veículo"
                    @submit="handleSubmit"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
