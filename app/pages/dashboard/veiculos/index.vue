<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';
import VehicleCard from '~/components/dashboard/VehicleCard.vue';
import ConfirmDialog from 'primevue/confirmdialog';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Meus Veículos - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie seus veículos e etiquetas de identificação.' }
    ]
});

// Lista de veículos (inicialmente vazia para demonstrar empty state)
// const vehicles = ref([]);

// Dados de exemplo (descomente para testar com veículos)
const vehicles = ref([
    { id: 1, plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Preto', etiqueta: 'amarela', comprada: true },
    { id: 2, plate: 'DEF-5678', brand: 'Honda', model: 'Civic', year: 2021, color: 'Branco', etiqueta: 'azul', comprada: true },
    { id: 3, plate: 'GHI-9012', brand: 'Volkswagen', model: 'Gol', year: 2020, color: 'Cinza', etiqueta: 'amarela', comprada: false }
]);

const handleVehicleDeleted = (vehicleId: number) => {
    vehicles.value = vehicles.value.filter(v => v.id !== vehicleId);
};
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
            <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
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
