<script setup lang="ts">
interface Veiculo {
    id: number;
    placa: string;
    brand: string;
    model: string;
    state: number;
    city: string;
    useProfile: string;
    temEtiqueta: boolean;
    selecionado: boolean;
}

const props = defineProps<{
    veiculo: Veiculo;
    precoUnitario: number;
    getEtiquetaImage: (perfilUso: string) => string;
}>();

const emit = defineEmits<{
    toggleSelecao: [id: number];
}>();

const handleToggleSelecao = (id: number) => {
    emit('toggleSelecao', id);
};

const handleViewDetails = (id: number) => {
    navigateTo(`/dashboard/veiculos/detalhes/${id}`);
};
</script>

<template>
    <div
        :class="[
            'rounded-2xl border-2 shadow-sm p-6 cursor-pointer transition',
            veiculo.selecionado
                ? 'border-it-primary bg-blue-50'
                : 'border-gray-100 bg-white hover:border-it-primary'
        ]"
        @click="handleToggleSelecao(veiculo.id)"
    >
        <!-- Checkbox no topo -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-it-primary">
                    <i class="pi pi-car"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-900 mb-0!">{{ veiculo.brand }} {{ veiculo.model }}</p>
                    <p class="text-sm text-gray-500">{{ veiculo.placa }}</p>
                </div>
            </div>
            <input
                type="checkbox"
                :checked="veiculo.selecionado"
                class="w-5 h-5 text-it-primary border-gray-300 rounded cursor-pointer"
                @click.stop="handleToggleSelecao(veiculo.id)"
            />
        </div>

        <!-- Detalhes do Veículo -->
        <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Estado</span>
                <span class="font-medium text-gray-900">{{ veiculo.state }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Cidade</span>
                <span class="font-medium text-gray-900">{{ veiculo.city }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Perfil</span>
                <span class="font-medium text-gray-900 capitalize">{{ veiculo.useProfile }}</span>
            </div>
        </div>

        <!-- Preço e Ações -->
        <div class="space-y-3">
            <!-- Etiqueta -->
            <div class="flex items-center justify-center py-3">
                <img
                    :src="getEtiquetaImage(veiculo.perfilUso)"
                    :alt="`Etiqueta para ${veiculo.perfilUso}`"
                    class="w-16 h-16 object-contain"
                />
            </div>

            <div class="flex items-baseline justify-between">
                <span class="text-sm text-gray-600">Preço</span>
                <span class="text-2xl font-bold text-it-primary">
                    R$ {{ precoUnitario.toFixed(2) }}
                </span>
            </div>
            
            <div class="flex gap-2 pt-2">
                <button
                    class="flex-1 px-3 py-2 flex justify-center items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 text-it-primary text-sm font-medium hover:bg-blue-100 transition"
                    @click.stop="handleViewDetails(veiculo.id)"
                >
                    <i class="pi pi-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        </div>

        <!-- Indicador de Seleção -->
        <div v-if="veiculo.selecionado" class="mt-4 flex items-center justify-center gap-2 text-it-primary font-medium text-sm">
            <i class="pi pi-check-circle"></i>
            Selecionado
        </div>
    </div>
</template>
