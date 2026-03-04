<script setup lang="ts">
import { ref, computed } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';
import Button from '~/components/forms/Button.vue';
import VehicleTagCard from '~/components/dashboard/VehicleTagCard.vue';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Comprar Etiquetas - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie suas etiquetas de identificação.' }
    ]
});

interface Vehicle {
    id: number;
    user_id: number;
    plate: string;
    name: string;
    year: string;
    color: string;
    type: number;
    type_label: string;
    register_state: string;
    register_city: string;
    usage_profile: number;
    usage_profile_label: string;
    tag_color: string;
    tag_price: string;
    tag_purchases: any[];
    created_at: string;
    updated_at: string;
    selected?: boolean;
}

const vehicles = ref<Vehicle[]>([]);

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

onMounted(fetchVehicles);

const loading = ref(false);
const toast = useToast();

const getTagImage = (tagColor: string) => {
    return tagColor ? `/images/dashboard/etiquetas/${tagColor}.svg` : '/images/dashboard/etiquetas/amarelo.svg';
};

const totalSelected = computed(() =>
    vehicles.value.filter(v => v.selected).length
);

const totalPrice = computed(() =>
    vehicles.value.filter(v => v.selected).reduce((sum, v) => sum + parseFloat(v.tag_price), 0)
);

const hasVehicles = computed(() => vehicles.value.length > 0);

const selectAll = () => {
    const allSelected = vehicles.value.every(v => v.selected);
    vehicles.value.forEach(v => v.selected = !allSelected);
};

const toggleSelection = (id: number) => {
    const vehicle = vehicles.value.find(v => v.id === id);
    if (vehicle) {
        vehicle.selected = !vehicle.selected;
    }
};

const handleComprar = () => {
    if (totalSelected.value === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Selecione pelo menos um veículo para comprar.',
            life: 3000
        });
        return;
    }

    const selectedVehiclesState = useState('selectedVehicles');
    selectedVehiclesState.value = vehicles.value.filter(v => v.selected);
    navigateTo('/dashboard/pagamento');
};
</script>

<template>
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            title="Comprar Etiquetas"
            subtitle="Compre etiquetas para seus veículos."
            :showButton="true"
            buttonLabel="Meus veículos"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-arrow-left"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex gap-6">
            <Skeleton v-for="n in 3" :key="n" width="33%" height="100" class="w-full h-100 rounded-lg" />
        </div>

        <!-- Empty State - Sem Veículos -->
        <div v-if="vehicles.length === 0 && !loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-it-primary text-5xl mb-6">
                <i class="pi pi-inbox"></i>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">Nenhum pedido encontrado</h3>
            <p class="text-gray-600 text-center max-w-md mb-8! leading-6">
                Você ainda não realizou nenhum pedido de etiqueta. Cadastre um veículo para começar a comprar suas etiquetas.
            </p>
            <ButtonLink
                to="/dashboard/veiculos/novo"
                variant="primary"
                size="md"
            >
                <i class="pi pi-plus"></i>
                cadastrar meu primeiro veículo
            </ButtonLink>
        </div>

        <!-- Com Veículos -->
        <div v-else class="space-y-6">
            <!-- Resumo de Seleção -->
            <div v-if="hasVehicles" class="bg-white rounded-2xl border-2 border-it-primary shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="selectAll"
                        :checked="totalSelected === vehicles.length && totalSelected > 0"
                        @change="selectAll"
                        class="w-6 h-6 text-it-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label for="selectAll" class="cursor-pointer">
                        <span class="text-lg font-semibold text-it-primary">
                            {{ totalSelected }}
                            <span v-if="totalSelected > 1">etiquetas selecionadas</span>
                            <span v-else>etiqueta selecionada</span>
                            para compra.
                        </span>
                    </label>
                </div>
                <Button
                    v-if="totalSelected > 0"
                    type="button"
                    variant="primary"
                    size="sm"
                    :loading="loading"
                    @click="handleComprar"
                >
                    <i class="pi pi-shopping-cart"></i>
                    Comprar (R$ {{ totalPrice.toFixed(2) }})
                </Button>
            </div>

            <!-- Cards de Veículos -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <VehicleTagCard
                    v-for="vehicle in vehicles"
                    :key="vehicle.id"
                    :vehicle="vehicle"
                    :get-tag-image="getTagImage"
                    @toggle-selection="toggleSelection"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
