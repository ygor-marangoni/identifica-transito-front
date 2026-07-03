<script setup lang="ts">

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
    can_purchase_tag: boolean;
    selected?: boolean;
}

const props = defineProps<{
    vehicle: Vehicle;
    getTagImage: (tagColor: string) => string;
}>();

const emit = defineEmits<{
    toggleSelection: [id: number];
}>();

const handleToggleSelection = (id: number) => {
    if (!props.vehicle.can_purchase_tag) return;
    emit('toggleSelection', id);
};

const handleViewDetails = (id: number) => {
    navigateTo(`/dashboard/veiculos/detalhes/${id}`);
};
</script>

<template>
    <div
        :class="[
            'rounded-2xl border-2 shadow-sm p-6 transition',
            vehicle.can_purchase_tag ? 'cursor-pointer' : 'cursor-default',
            vehicle.selected
                ? 'border-it-primary bg-blue-50'
                : vehicle.can_purchase_tag ? 'border-gray-100 bg-white hover:border-it-primary' : 'border-gray-100 bg-gray-50'
        ]"
        @click="handleToggleSelection(vehicle.id)"
    >
        <!-- Checkbox no topo -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-it-primary">
                    <i class="pi pi-car"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-900 mb-0!">{{ vehicle.name }}</p>
                    <p class="text-sm text-gray-500">{{ vehicle.plate }}</p>
                </div>
            </div>
            <input
                v-if="vehicle.can_purchase_tag"
                type="checkbox"
                :checked="vehicle.selected"
                class="w-5 h-5 text-it-primary border-gray-300 rounded cursor-pointer"
                @click.stop="handleToggleSelection(vehicle.id)"
            />
        </div>

        <!-- Detalhes do Veículo -->
        <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600 font-semibold">Estado</span>
                <span class="font-medium text-gray-900">{{ vehicle.register_state }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600 font-semibold">Cidade</span>
                <span class="font-medium text-gray-900">{{ vehicle.register_city }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600 font-semibold">Perfil</span>
                <span class="font-medium text-gray-900 capitalize">{{ vehicle.usage_profile_label }}</span>
            </div>
        </div>

        <!-- Preço e Ações -->
        <div class="space-y-3">
            <!-- Etiqueta -->
            <div class="flex items-center justify-center py-3">
                <img
                    :src="getTagImage(vehicle.tag_color)"
                    :alt="`Etiqueta para ${vehicle.usage_profile_label}`"
                    class="w-16 h-16 object-contain"
                />
            </div>

            <div class="flex items-baseline justify-between">
                <span class="text-sm text-gray-600">Preço</span>
                <span class="text-2xl font-bold text-it-primary">
                    R$ {{ parseFloat(vehicle.tag_price).toFixed(2) }}
                </span>
            </div>

            <div class="flex gap-2 pt-2">
                <button
                    class="flex-1 px-3 py-2 flex justify-center items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 text-it-primary text-sm font-medium hover:bg-blue-100 transition"
                    @click.stop="handleViewDetails(vehicle.id)"
                >
                    <i class="pi pi-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        </div>

        <!-- Indicador de Seleção -->
        <div v-if="vehicle.selected" class="mt-4 flex items-center justify-center gap-2 text-it-primary font-medium text-sm">
            <i class="pi pi-check-circle"></i>
            Selecionado
        </div>
        <div v-else-if="!vehicle.can_purchase_tag" class="mt-4 flex items-center justify-center gap-2 text-gray-500 font-medium text-sm">
            <i class="pi pi-lock"></i>
            Etiqueta já adquirida para esta placa
        </div>
    </div>
</template>
