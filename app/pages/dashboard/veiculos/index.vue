<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';

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
    { id: 1, plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Preto', etiqueta: 'amarela' },
    { id: 2, plate: 'DEF-5678', brand: 'Honda', model: 'Civic', year: 2021, color: 'Branco', etiqueta: 'azul' },
    { id: 3, plate: 'GHI-9012', brand: 'Volkswagen', model: 'Gol', year: 2020, color: 'Cinza', etiqueta: null }
]);

// Mapeamento de cores de etiqueta para caminhos de arquivo
const getEtiquetaImagePath = (cor: string | null) => {
    if (!cor) return null;
    const colorMap: { [key: string]: string } = {
        'amarela': '/images/dashboard/etiquetas/amarelo.svg',
        'azul': '/images/dashboard/etiquetas/azul.svg',
        'verde': '/images/dashboard/etiquetas/verde.svg',
        'vermelho': '/images/dashboard/etiquetas/vermelho.svg',
        'laranja': '/images/dashboard/etiquetas/laranja.svg'
    };
    return colorMap[cor.toLowerCase()] || null;
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
                <div
                    v-for="vehicle in vehicles"
                    :key="vehicle.id"
                    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-it-primary text-xl">
                            <i class="pi pi-car"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                            <p class="text-sm text-gray-500">{{ vehicle.plate }} • {{ vehicle.year }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <!-- Com etiqueta -->
                        <div v-if="vehicle.etiqueta" class="flex flex-col items-center gap-2">
                            <img
                                :src="getEtiquetaImagePath(vehicle.etiqueta)"
                                :alt="`Etiqueta ${vehicle.etiqueta}`"
                                class="w-12 h-12 object-contain"
                            />
                            <p class="text-xs text-gray-500 capitalize">{{ vehicle.etiqueta }}</p>
                        </div>
                        <!-- Sem etiqueta -->
                        <div v-else class="flex flex-col items-center gap-2">
                            <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-400">
                                <i class="pi pi-times"></i>
                            </div>
                            <p class="text-xs text-gray-500">Não comprada</p>
                        </div>
                        <div class="w-px h-12 bg-gray-200 hidden md:block"></div>
                        <!-- Botão de compra ou ações -->
                        <div class="flex gap-2">
                            <template v-if="vehicle.etiqueta">
                                <NuxtLink :to="`/dashboard/veiculos/${vehicle.id}/editar`" class="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-it-primary hover:text-it-primary transition">
                                    Editar
                                </NuxtLink>
                                <button class="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition">
                                    Excluir
                                </button>
                            </template>
                            <template v-else>
                                <ButtonLink
                                    to="/dashboard/etiquetas/comprar"
                                    variant="primary"
                                    size="sm"
                                >
                                    <i class="pi pi-shopping-cart"></i>
                                    Comprar Etiqueta
                                </ButtonLink>
                            </template>
                        </div>
                    </div>
                </div>
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
