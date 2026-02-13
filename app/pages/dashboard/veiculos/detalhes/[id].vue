<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';
import Button from '~/components/forms/Button.vue';
import PrimeButton from 'primevue/button';
import { useVehicleActions } from '~/composables/useVehicleActions';
import { useToast } from 'primevue/usetoast';
import { getUsageProfileLabel, getVehicleTypeLabel } from '~/utils/vehicleEnums';
import Skeleton from 'primevue/skeleton';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Detalhes do Veículo - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Visualize os detalhes de seu veículo e etiqueta de identificação.' }
    ]
});

const route = useRoute();
const { confirmDelete } = useVehicleActions();
const toast = useToast();

const vehicleData = ref({
    id: route.params.id || '',
    placa: '',
    tipo: '',
    registro: '',
    perfilUso: '',
    dataCadastro: '',
    etiqueta: {
        codigo: '',
        tipo: 'Indisponível',
        imagem: '/images/dashboard/etiquetas/azul.svg'
    }
});

const loading = ref(false);

const mapVehicleData = (vehicle: Record<string, any>) => {
    const registro = [vehicle.register_city, vehicle.register_state].filter(Boolean).join(' - ');
    return {
        id: vehicle.id,
        placa: vehicle.plate || '',
        tipo: getVehicleTypeLabel(vehicle.type) || String(vehicle.type || ''),
        registro,
        perfilUso: getUsageProfileLabel(vehicle.usage_profile) || String(vehicle.usage_profile || ''),
        dataCadastro: vehicle.created_at || '',
        etiqueta: vehicle.etiqueta || {
            codigo: 'COD123',
            tipo: vehicle.type_label?.toUpperCase() || 'Indisponível',
            imagem: '/images/dashboard/etiquetas/azul.svg'
        }
    };
};

const getRouteId = (params: Record<string, any> = route.params) => {
    const id = params.id;
    return Array.isArray(id) ? id[0] : id;
};

const fetchVehicleDetails = async (id?: string | string[]) => {
    const vehicleId = Array.isArray(id) ? id[0] : id || getRouteId();
    if (!vehicleId) return;

    loading.value = true;
    try {
        const { $api } = useNuxtApp();
        const response = await $api(`/vehicles/${vehicleId}`) as any;
        const vehicle = response?.data || response;
        vehicleData.value = mapVehicleData(vehicle);
    } catch (error: any) {
        const apiMessage = error?.data?.message || error?.data?.error;
        const errorMsg = apiMessage || error?.message || 'Não foi possível carregar o veículo.';
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

const handleExcluirVeiculo = () => {
    confirmDelete(
        vehicleData.value.id,
        vehicleData.value.placa,
        () => {
            navigateTo('/dashboard/veiculos');
        }
    );
};

const handleEditar = () => {
    navigateTo(`/dashboard/veiculos/editar/${vehicleData.value.id}`);
};

const handleComprarEtiqueta = () => {
    navigateTo('/dashboard/pagamento');
};

onMounted(() => {
    fetchVehicleDetails();
});

onBeforeRouteUpdate((to) => {
    fetchVehicleDetails(to.params.id as string | string[]);
});
</script>

<template>
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            title="Detalhes do Veículo"
            :subtitle="`Placa: ${vehicleData.placa}`"
            :showButton="true"
            buttonLabel="Voltar à pagina anterior"
            buttonLinkBack
            buttonIcon="pi pi-arrow-left"
        />

        <!-- Grid com Informações e Etiqueta -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Informações do Veículo -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                    <h2 class="text-2xl! font-bold text-gray-900 mb-6">Informações do Veículo</h2>
                    
                    <div class="space-y-5">
                        <!-- Placa -->
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-it-primary shrink-0">
                                <i class="pi pi-car"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-600 mb-1">Placa</p>
                                <Skeleton v-if="loading" width="100%" height="16px" class="mb-1" />
                                <p v-else class="font-semibold text-gray-900 wrap-break-word">{{ vehicleData.placa }}</p>
                            </div>
                        </div>

                        <!-- Tipo -->
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                <i class="pi pi-list"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-600 mb-1">Tipo</p>
                                <Skeleton v-if="loading" width="100%" height="16px" class="mb-1" />
                                <p v-else class="font-semibold text-gray-900">{{ vehicleData.tipo }}</p>
                            </div>
                        </div>

                        <!-- Registro -->
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <i class="pi pi-map-marker"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-600 mb-1">Registro</p>
                                <Skeleton v-if="loading" width="100%" height="16px" class="mb-1" />
                                <p v-else class="font-semibold text-gray-900">{{ vehicleData.registro }}</p>
                            </div>
                        </div>

                        <!-- Perfil de Uso -->
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                                <i class="pi pi-user"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-600 mb-1">Perfil de Uso</p>
                                <Skeleton v-if="loading" width="100%" height="16px" class="mb-1" />
                                <p v-else class="font-semibold text-gray-900">{{ vehicleData.perfilUso }}</p>
                            </div>
                        </div>

                        <!-- Data de Cadastro -->
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <i class="pi pi-calendar"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-600 mb-1">Data de Cadastro</p>
                                <Skeleton v-if="loading" width="100%" height="16px" class="mb-1" />
                                <p v-else class="font-semibold text-gray-900">{{ vehicleData.dataCadastro }}</p>
                                <!-- Botões de Ação -->
                                <div class="border-t border-gray-200 pt-6 mt-6 flex flex-col gap-3">
                                    <PrimeButton @click="handleEditar" label="Editar" icon="pi pi-pencil" severity="info" outlined />
                                    <PrimeButton @click="handleExcluirVeiculo" :disabled="loading" :label="loading ? 'Excluindo...' : 'Excluir veículo'" icon="pi pi-trash" severity="danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kit de Etiquetas -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-full">
                    <h2 class="text-center text-2xl! font-bold text-it-primary mb-8">Meu Kit de Etiquetas Identifica Trânsito</h2>
                    
                    <div class="flex flex-col items-center">
                        <!-- Card da Etiqueta -->
                        <div class="border-2 border-gray-900 rounded-2xl p-8 w-full max-w-sm bg-linear-to-b from-gray-50 to-white mb-8">
                            <p class="text-center text-sm font-semibold text-gray-900 mb-2">IDENTIFICA</p>
                            <p class="text-center text-sm font-semibold text-gray-900 mb-6">TRÂNSITO</p>
                            
                            <!-- QR Code -->
                            <div class="flex justify-center mb-6">
                                <img
                                    :src="vehicleData.etiqueta.imagem"
                                    :alt="vehicleData.etiqueta.tipo"
                                    class="w-40 h-40 object-contain"
                                />
                            </div>

                            <p class="text-center text-xs font-semibold text-gray-900 mb-1">{{ vehicleData.etiqueta.codigo || 'N/A'}}</p>
                            <Skeleton v-if="loading" width="80px" height="16px" class="mx-auto mb-1" />
                            <p v-else class="text-center text-xs text-gray-600">{{ vehicleData.etiqueta.tipo }}</p>
                        </div>

                        <!-- Informações da Etiqueta -->
                        <div class="text-center mb-8 w-full">
                            <p class="text-sm text-gray-600 mb-1">Veículo: 
                                <Skeleton v-if="loading" width="80px" height="16px" class="mx-auto mb-1" />
                                <span v-else>{{ vehicleData.placa }}</span>
                            </p>
                            <p class="text-sm font-semibold text-gray-900 mb-4">
                                Código do Kit: <span class="text-it-primary">{{ vehicleData.etiqueta.codigo }}</span>
                            </p>
                            <p class="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                                Disponível para compra
                            </p>
                        </div>

                        <!-- Botão Comprar -->
                        <Button
                            @click="handleComprarEtiqueta"
                            variant="primary"
                            size="md"
                            
                        >
                            <i class="pi pi-shopping-cart"></i>
                            Comprar Kit (2 Etiquetas)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
