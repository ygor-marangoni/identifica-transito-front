<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CarFront } from '@lucide/vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import VehicleCard from '~/components/dashboard/VehicleCard.vue';
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
    <div class="space-y-6 md:space-y-7">
        <!-- Hero -->
        <HeroSection
            greeting="Lista de veículos"
            title="Meus Veículos"
            subtitle="Gerencie seus veículos e etiquetas Identifica Trânsito."
            :showButton="true"
            :greeting-icon="CarFront"
            buttonLabel="Cadastrar veículo"
            buttonLink="/dashboard/veiculos/novo"
        />

        <!-- Lista de Veículos ou Empty State -->
        <section class="space-y-4">
            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <Skeleton v-for="n in 3" :key="n" width="100%" height="5rem" class="w-full h-50 rounded-lg" />
            </div>

            <!-- Com veículos -->
            <div v-if="vehicles.length > 0" class="space-y-3">
                <VehicleCard
                    v-for="vehicle in vehicles"
                    :key="vehicle.id"
                    :vehicle="vehicle"
                    @vehicle-deleted="handleVehicleDeleted"
                />
            </div>

            <!-- Sem veículos -->
            <div v-if="!loading && vehicles.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#1f46ee]">
                    <CarFront :size="31" :stroke-width="1.8" aria-hidden="true" />
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-[#1f46ee]">Sua garagem está vazia</p>
                <h3 class="mt-2 text-2xl! font-semibold text-[#0c0f1a] mb-0!">Nenhum veículo cadastrado</h3>
                <p class="mt-3 max-w-md text-gray-600 leading-6">
                    Você ainda não cadastrou nenhum veículo. Adicione seu primeiro veículo para gerar sua etiqueta Identifica Trânsito.
                </p>
                <NuxtLink to="/dashboard/veiculos/novo" class="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f46ee] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1739d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f46ee]">
                    <Plus :size="18" :stroke-width="2.2" aria-hidden="true" />
                    Cadastrar meu primeiro veículo
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
