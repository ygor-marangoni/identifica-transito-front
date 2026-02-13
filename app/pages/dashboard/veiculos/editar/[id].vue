<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import VehicleForm from '~/components/forms/VehicleForm.vue';
import { useToast } from 'primevue/usetoast';
import { getStateUF } from '~/utils/vehicleEnums';
import { createEmptyFormData } from '~/utils/vehicleFormData';


definePageMeta({
    layout: 'dashboard'
});

const route = useRoute();
const toast = useToast();

const formData = ref(createEmptyFormData());
const loading = ref(false);
const municipios = ref<Array<{ label: string; value: string }>>([]);
const municipiosLoading = ref(false);

// Variável para controlar requisições em voo
let fetchAbortController: AbortController | null = null;

/*
|--------------------------------------------------------------------------
| HEAD DINÂMICO
|--------------------------------------------------------------------------
*/

const pageTitle = computed(() => {
  if (formData.value.placa) {
    return `Editar Veículo ${formData.value.placa.toUpperCase()}`.trim();
  }
  return 'Editar Veículo';
});

useHead(() => ({
  title: `${pageTitle.value} - Identifica Trânsito`,
  meta: [
    {
      name: 'description',
      content: 'Atualize as informações do seu veículo.'
    }
  ]
}));

/*
|--------------------------------------------------------------------------
| MUNICÍPIOS
|--------------------------------------------------------------------------
*/

const fetchMunicipios = async (uf: string, preserveSelection = false) => {
  if (!uf) {
    municipios.value = [];
    if (!preserveSelection) formData.value.cidadeRegistro = '';
    return;
  }

  municipiosLoading.value = true;

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );

    const data = await response.json();

    municipios.value = data
      .map((municipio: any) => ({
        label: municipio.nome,
        value: municipio.nome
      }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label));

    if (!preserveSelection) {
      formData.value.cidadeRegistro = '';
    }

  } catch (error) {
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

watch(
  () => formData.value.estadoRegistro,
  (newUF) => {
    if (newUF) fetchMunicipios(newUF);
  }
);

/*
|--------------------------------------------------------------------------
| BUSCAR VEÍCULO
|--------------------------------------------------------------------------
*/

const fetchVehicleData = async (id: string) => {
  if (!id) {
    return;
  }

  // Cancelar requisição anterior se estiver em andamento
  if (fetchAbortController) {
    fetchAbortController.abort();
  }
  
  fetchAbortController = new AbortController();
  const signal = fetchAbortController.signal;

  loading.value = true;

  try {
    const { $api } = useNuxtApp();
    
    // Log ANTES de fazer a requisição
    
    const response = await $api(`/vehicles/${id}`, { signal }) as any;
    const vehicle = response?.data || response;

    const stateUF = getStateUF(vehicle?.register_state);
    const cityToSet = vehicle?.register_city || '';

    formData.value = {
      placa: vehicle?.plate || '',
      tipoVeiculo: Number(vehicle?.type) || null,
      estadoRegistro: stateUF,
      cidadeRegistro: '',
      perfilUso: Number(vehicle?.usage_profile) || null
    };

    if (formData.value.estadoRegistro) {
      await fetchMunicipios(formData.value.estadoRegistro, true);
      await nextTick();
      formData.value.cidadeRegistro = cityToSet;
    }

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⚠️ Requisição cancelada para ID:', id);
      return;
    }
    
    const apiMessage = error?.data?.message || error?.data?.error;
    const errorMsg = apiMessage || 'Não foi possível carregar o veículo.';
    console.error('❌ Erro ao buscar ID:', id, errorMsg);

    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: errorMsg,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| LIFECYCLE & WATCHERS
|--------------------------------------------------------------------------
*/

// Watcher para capturar mudanças de ID (F5 ou NuxtLink)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      formData.value = createEmptyFormData();
      municipios.value = [];
      fetchVehicleData(newId as string);
    }
  },
  { immediate: true }
);

/*
|--------------------------------------------------------------------------
| SUBMIT
|--------------------------------------------------------------------------
*/

const handleSubmit = async () => {
  if (
    !formData.value.placa ||
    !formData.value.tipoVeiculo ||
    !formData.value.estadoRegistro ||
    !formData.value.cidadeRegistro ||
    !formData.value.perfilUso
  ) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao salvar',
      detail: 'Por favor, preencha todos os campos obrigatórios.',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    const { $api } = useNuxtApp();

    await $api(`/vehicles/${route.params.id}`, {
      method: 'PUT',
      body: {
        plate: formData.value.placa,
        type: Number(formData.value.tipoVeiculo),
        register_state: formData.value.estadoRegistro,
        register_city: formData.value.cidadeRegistro,
        usage_profile: Number(formData.value.perfilUso)
      }
    });

    toast.add({
      severity: 'success',
      summary: 'Veículo atualizado!',
      detail: 'Seu veículo foi atualizado com sucesso.',
      life: 3000
    });

    navigateTo(`/dashboard/veiculos/detalhes/${route.params.id}`);

  } catch (error: any) {
    const apiMessage = error?.data?.message || error?.data?.error;
    const errorMsg = apiMessage || 'Não foi possível salvar o veículo.';

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
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            :title="`Editar Veículo ${formData.placa?.toUpperCase() || ''}`"
            subtitle="Atualize os dados do seu veículo."
            :showButton="true"
            buttonLabel="Voltar para Meus Veículos"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-arrow-left"
        />
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 relative">
                <Skeleton v-if="loading" width="100%" height="60px" class="mb-4" />
                <div v-else>
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">{{ pageTitle }}</h1>
                    <p class="text-gray-600 mb-8!">
                        Atualize as informações do seu veículo.
                    </p>
                </div>

                <VehicleForm
                  :formData="formData"
                  :municipios="municipios"
                  :municipiosLoading="municipiosLoading"
                  :loading="loading"
                  buttonLabel="Salvar alterações"
                  @submit="handleSubmit"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
