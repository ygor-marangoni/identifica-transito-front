<script setup lang="ts">
import { ref, computed } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import ButtonLink from '~/components/ButtonLink.vue';
import Button from '~/components/forms/Button.vue';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Minhas Etiquetas - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie suas etiquetas de identificação.' }
    ]
});

// Dados simulados de veículos disponíveis para compra de etiquetas
const veiculosDisponiveis = ref([
    {
        id: 1,
        placa: 'ABC-1234',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Preto',
        perfilUso: 'idoso',
        temEtiqueta: false,
        selecionado: false
    },
    {
        id: 2,
        placa: 'DEF-5678',
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        color: 'Branco',
        perfilUso: 'autista',
        temEtiqueta: false,
        selecionado: false
    },
    {
        id: 3,
        placa: 'GHI-9012',
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2020,
        color: 'Cinza',
        perfilUso: 'aplicativo',
        temEtiqueta: false,
        selecionado: false
    }
]);

// const veiculosDisponiveis = ref([]);

const loading = ref(false);
const toast = useToast();

// Mapeamento de perfilUso para arquivo de etiqueta
const getEtiquetaImage = (perfilUso: string) => {
    const colorMap: { [key: string]: string } = {
        'idoso': '/images/dashboard/etiquetas/amarelo.svg',
        'autista': '/images/dashboard/etiquetas/azul.svg',
        'deficiencias_ocultas': '/images/dashboard/etiquetas/verde.svg',
        'gestante': '/images/dashboard/etiquetas/amarelo.svg',
        'recem_nascido': '/images/dashboard/etiquetas/laranja.svg',
        'cnh_definitiva': '/images/dashboard/etiquetas/verde.svg',
        'cnh_temporaria': '/images/dashboard/etiquetas/amarelo.svg',
        'empresa': '/images/dashboard/etiquetas/azul.svg',
        'aplicativo': '/images/dashboard/etiquetas/vermelho.svg'
    };
    return colorMap[perfilUso] || '/images/dashboard/etiquetas/amarelo.svg';
};

// Computed properties
const totalSelecionados = computed(() => 
    veiculosDisponiveis.value.filter(v => v.selecionado).length
);

const precoUnitario = 29.90;
const precoTotal = computed(() => 
    totalSelecionados.value * precoUnitario
);

const temVeiculos = computed(() => veiculosDisponiveis.value.length > 0);

// Métodos
const selecionarTodos = () => {
    const temTodosSelecionados = veiculosDisponiveis.value.every(v => v.selecionado);
    
    if (temTodosSelecionados) {
        // Desselecionar todos
        veiculosDisponiveis.value.forEach(v => v.selecionado = false);
    } else {
        // Selecionar todos
        veiculosDisponiveis.value.forEach(v => v.selecionado = true);
    }
};

const toggleSelecao = (id: number) => {
    const veiculo = veiculosDisponiveis.value.find(v => v.id === id);
    if (veiculo) {
        veiculo.selecionado = !veiculo.selecionado;
    }
};

const handleComprar = () => {
    if (totalSelecionados.value === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Selecione pelo menos um veículo para comprar.',
            life: 3000
        });
        return;
    }

    loading.value = true;
    console.log('Comprando etiquetas para:', 
        veiculosDisponiveis.value.filter(v => v.selecionado).map(v => v.placa)
    );

    // Simular compra
    setTimeout(() => {
        loading.value = false;
        toast.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `${totalSelecionados.value} etiqueta(s) adicionada(s) ao carrinho.`,
            life: 3000
        });
        // Aqui você pode redirecionar para o carrinho/checkout
        // navigateTo('/dashboard/carrinho');
    }, 1500);
};
</script>

<template>
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            title="Minhas Etiquetas"
            subtitle="Compre etiquetas para seus veículos."
            :showButton="true"
            buttonLabel="Meus veículos"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-arrow-left"
        />

        <!-- Empty State - Sem Veículos -->
        <div v-if="!temVeiculos" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
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
            <div v-if="temVeiculos" class="bg-white rounded-2xl border-2 border-it-primary shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="selecionarTodos"
                        :checked="totalSelecionados === veiculosDisponiveis.length && totalSelecionados > 0"
                        @change="selecionarTodos"
                        class="w-6 h-6 text-it-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label for="selecionarTodos" class="cursor-pointer">
                        <span class="text-lg font-semibold text-it-primary">
                            {{ totalSelecionados }} 
                            <span v-if="totalSelecionados !== 1">etiqueta(s)</span>
                            <span v-else>etiqueta</span>
                            selecionada(s) para compra.
                        </span>
                    </label>
                </div>
                <Button
                    v-if="totalSelecionados > 0"
                    type="button"
                    variant="primary"
                    size="sm"
                    :loading="loading"
                    @click="handleComprar"
                >
                    <i class="pi pi-shopping-cart"></i>
                    Pagar Selecionadas (R$ {{ precoTotal.toFixed(2) }})
                </Button>
            </div>

            <!-- Cards de Veículos -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="veiculo in veiculosDisponiveis"
                    :key="veiculo.id"
                    :class="[
                        'rounded-2xl border-2 shadow-sm p-6 cursor-pointer transition',
                        veiculo.selecionado
                            ? 'border-it-primary bg-blue-50'
                            : 'border-gray-100 bg-white hover:border-it-primary'
                    ]"
                    @click="toggleSelecao(veiculo.id)"
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
                            @click.stop="toggleSelecao(veiculo.id)"
                        />
                    </div>

                    <!-- Detalhes do Veículo -->
                    <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Ano</span>
                            <span class="font-medium text-gray-900">{{ veiculo.year }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Cor</span>
                            <span class="font-medium text-gray-900">{{ veiculo.color }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Perfil</span>
                            <span class="font-medium text-gray-900 capitalize">{{ veiculo.perfilUso }}</span>
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
                            <span class="text-sm text-gray-600">Etiqueta</span>
                            <span class="text-2xl font-bold text-it-primary">
                                R$ {{ precoUnitario.toFixed(2) }}
                            </span>
                        </div>
                        
                        <div class="flex gap-2 pt-2">
                            <button
                                class="flex-1 px-3 py-2 flex justify-center items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 text-it-primary text-sm font-medium hover:bg-blue-100 transition"
                                @click.stop="navigateTo(`/dashboard/etiquetas/${veiculo.id}`)"
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
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
