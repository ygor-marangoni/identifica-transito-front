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
        state: 'São Paulo',
        city: 'São Bernardo',
        useProfile: 'idoso',
        temEtiqueta: false,
        selecionado: false
    },
    {
        id: 2,
        placa: 'DEF-5678',
        brand: 'Honda',
        model: 'Civic',
        state: 'São Paulo',
        city: 'São Bernardo',
        useProfile: 'autista',
        temEtiqueta: false,
        selecionado: false
    },
    {
        id: 3,
        placa: 'GHI-9012',
        brand: 'Volkswagen',
        model: 'Gol',
        state: 'São Paulo',
        city: 'São Bernardo',
        useProfile: 'aplicativo',
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

    // Ir direto para a tela de pagamento
    navigateTo('/dashboard/pagamento');
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
                            <span v-if="totalSelecionados > 1">etiquetas selecionadas</span>
                            <span v-else>etiqueta selecionada</span>
                            para compra.
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
                    Comprar (R$ {{ precoTotal.toFixed(2) }})
                </Button>
            </div>

            <!-- Cards de Veículos -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <VehicleTagCard
                    v-for="veiculo in veiculosDisponiveis"
                    :key="veiculo.id"
                    :veiculo="veiculo"
                    :preco-unitario="precoUnitario"
                    :get-etiqueta-image="getEtiquetaImage"
                    @toggle-selecao="toggleSelecao"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
