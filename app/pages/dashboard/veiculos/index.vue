<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';
import VehicleCard from '~/components/dashboard/VehicleCard.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import Skeleton from 'primevue/skeleton';

interface Vehicle {
    id: number | string;
    [key: string]: any;
}

definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Meus Veículos - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie seus veículos e etiquetas de identificação.' }
    ]
});

const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const toast = useToast();

const fetchVehicles = async () => {
    loading.value = true;
    try {
        const { $api } = useNuxtApp();
        const response = await $api('/vehicles');
        const data = response?.data || response;
        vehicles.value = Array.isArray(data) ? data : data?.data || [];
    } catch (error: any) {
        const apiMessage = error?.data?.message || error?.data?.error;
        const errorMsg = apiMessage || error?.message || 'Não foi possível carregar os veículos.';
        toast.add({
            severity: 'error',
            summary: 'Erro ao carregar',
            detail: errorMsg,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const handleVehicleDeleted = (vehicleId: number | string) => {
    vehicles.value = vehicles.value.filter(v => v.id !== vehicleId);
};

onMounted(fetchVehicles);
</script>

<template>
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            title="Meus Veículos"
            subtitle="Gerencie seus veículos e etiquetas Identifica Trânsito."
            :showButton="true"
            buttonLabel="Cadastrar Novo Veículo"
            buttonLink="/dashboard/veiculos/novo"
        />

        <!-- Lista de Veículos ou Empty State -->
        <section>

            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <Skeleton v-for="n in 3" :key="n" width="100%" height="5rem" class="w-full h-50 rounded-lg" />
            </div>

            <!-- Com veículos -->
            <div v-if="vehicles.length > 0" class="space-y-4">
                <VehicleCard
                    v-for="vehicle in vehicles"
                    :key="vehicle.id"
                    :vehicle="vehicle"
                    @vehicle-deleted="handleVehicleDeleted"
                />
            </div>

            <!-- Sem veículos -->
            <div v-if="!loading && vehicles.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-it-primary text-4xl mb-4">
                    <i class="pi pi-car"></i>
                </div>
                <h3 class="text-2xl font-semibold text-gray-900 mb-2">Nenhum veículo cadastrado</h3>
                <p class="text-gray-600 text-center max-w-md mb-12! leading-6">
                    Você ainda não cadastrou nenhum veículo. Adicione seu primeiro veículo para gerar sua etiqueta Identifica Trânsito.
                </p>
                <ButtonLink
                    to="/dashboard/veiculos/novo"
                    variant="primary"
                    size="md"
                >
                    <i class="pi pi-plus"></i>
                    Cadastrar meu primeiro veículo
                </ButtonLink>
            </div>
        </section>
    </div>
</template>
