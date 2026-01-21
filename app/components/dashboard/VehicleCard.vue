<script setup lang="ts">
import ButtonLink from '~/components/ButtonLink.vue';
import { useVehicleActions } from '~/composables/useVehicleActions';
import { useRuntimeConfig } from '#imports';

interface Vehicle {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    etiqueta: string;
    comprada: boolean;
}

defineProps<{
    vehicle: Vehicle;
}>();

const emit = defineEmits<{
    vehicleDeleted: [id: number];
}>();

const { confirmDelete } = useVehicleActions();

const handleDelete = (vehicle: Vehicle) => {
    confirmDelete(
        vehicle.id,
        `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`,
        () => {
            emit('vehicleDeleted', vehicle.id);
        }
    );
};

// Ajuda a compor URLs de assets respeitando app.baseURL em produção
const runtimeConfig = useRuntimeConfig();
const assetWithBase = (path: string) => {
    const base = runtimeConfig.app?.baseURL || '/';
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

// Mapeamento de cores de etiqueta para caminhos de arquivo
const getEtiquetaImagePath = (cor: string | null) => {
    if (!cor) return undefined;
    const colorMap: { [key: string]: string } = {
        'amarela': '/images/dashboard/etiquetas/amarelo.svg',
        'azul': '/images/dashboard/etiquetas/azul.svg',
        'verde': '/images/dashboard/etiquetas/verde.svg',
        'vermelho': '/images/dashboard/etiquetas/vermelho.svg',
        'laranja': '/images/dashboard/etiquetas/laranja.svg'
    };
    const src = colorMap[cor.toLowerCase()];
    return src ? assetWithBase(src) : undefined;
};
</script>

<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-it-primary text-xl">
                <i class="pi pi-car"></i>
            </div>
            <div>
                <h3 class="font-semibold text-gray-900 text-2xl! mb-0!">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <p class="text-sm text-gray-500">{{ vehicle.plate }} • {{ vehicle.year }}</p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <!-- Etiqueta com indicador de compra -->
            <div class="flex flex-col items-center gap-2 relative">
                <img
                    :src="getEtiquetaImagePath(vehicle.etiqueta)"
                    :alt="`Etiqueta ${vehicle.etiqueta}`"
                    class="w-12 h-12 object-contain"
                />
                <!-- Indicador de status -->
                <div
                    :class="[
                        'absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold',
                        vehicle.comprada ? 'bg-green-500' : 'bg-yellow-500'
                    ]"
                >
                    <i :class="[
                        'pi text-xs',
                        vehicle.comprada ? 'pi-check' : 'pi-exclamation-circle'
                    ]"></i>
                </div>
                <p class="text-xs text-gray-500 capitalize">{{ vehicle.etiqueta }}</p>
            </div>
            <div class="w-px h-12 bg-gray-200 hidden md:block"></div>
            <!-- Botão de compra ou ações -->
            <div class="flex gap-2">
                <NuxtLink
                    :to="`/dashboard/veiculos/novo?editar=${vehicle.id}`"
                    class="px-3 py-2 flex items-center gap-2 justify-center rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-it-primary hover:text-it-primary transition hover:bg-gray-50"
                >
                    <i class="pi pi-pencil"></i>
                    <span class="hidden sm:block">Editar</span>
                </NuxtLink>
                <button 
                    @click="handleDelete(vehicle)"
                    class="px-3 py-2 flex items-center gap-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                >
                    <i class="pi pi-trash"></i>
                    <span class="hidden sm:block">Excluir</span>
                </button>
                <ButtonLink
                    to="/dashboard/etiquetas"
                    variant="secondary"
                    size="sm"
                >
                    <i class="pi pi-shopping-cart"></i>
                    {{ vehicle.comprada ? 'Comprar novamente' : 'Comprar Etiqueta' }}
                </ButtonLink>
            </div>
        </div>
    </div>
</template>
