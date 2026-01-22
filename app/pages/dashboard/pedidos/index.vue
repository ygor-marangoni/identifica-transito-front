<script setup lang="ts">
import { ref, computed } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import Button from '~/components/forms/Button.vue';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Meus Pedidos - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Acompanhe todos os seus pedidos de etiquetas.' }
    ]
});

// Filtros e estado
const selectedStatus = ref('todos');
const searchQuery = ref('');

// Dados dos pedidos (simular API)
const allOrders = ref([
    {
        id: '#PED-1234',
        date: '15/01/2026',
        items: [
            { name: 'Etiqueta Laranja', quantity: 2, price: 49.90 }
        ],
        total: 99.80,
        status: 'entregue',
        trackingCode: 'BR123456789',
        deliveryDate: '20/01/2026',
        paymentMethod: 'Cartão de Crédito'
    },
    {
        id: '#PED-1235',
        date: '18/01/2026',
        items: [
            { name: 'Etiqueta Amarela', quantity: 1, price: 49.90 }
        ],
        total: 49.90,
        status: 'em-rota',
        trackingCode: 'BR987654321',
        estimatedDelivery: '23/01/2026',
        paymentMethod: 'PIX'
    },
    {
        id: '#PED-1236',
        date: '20/01/2026',
        items: [
            { name: 'Etiqueta Azul', quantity: 3, price: 49.90 }
        ],
        total: 149.70,
        status: 'em-andamento',
        estimatedDelivery: '25/01/2026',
        paymentMethod: 'Boleto'
    },
    {
        id: '#PED-1237',
        date: '12/01/2026',
        items: [
            { name: 'Etiqueta Verde', quantity: 1, price: 49.90 }
        ],
        total: 49.90,
        status: 'cancelado',
        cancelReason: 'Cancelado pelo cliente',
        cancelDate: '13/01/2026',
        paymentMethod: 'Cartão de Crédito'
    },
    {
        id: '#PED-1238',
        date: '10/01/2026',
        items: [
            { name: 'Etiqueta Vermelha', quantity: 2, price: 49.90 },
            { name: 'Etiqueta Azul', quantity: 1, price: 49.90 }
        ],
        total: 149.70,
        status: 'entregue',
        trackingCode: 'BR555444333',
        deliveryDate: '14/01/2026',
        paymentMethod: 'PIX'
    }
]);

// Configuração de status
const statusConfig = {
    'em-andamento': {
        label: 'Em andamento',
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgLight: 'bg-blue-50',
        darkBgLight: 'dark:bg-blue-900/20',
        darkTextColor: 'dark:text-blue-300',
        icon: 'pi pi-clock'
    },
    'em-rota': {
        label: 'Em rota de entrega',
        color: 'bg-orange-500',
        textColor: 'text-orange-700',
        bgLight: 'bg-orange-50',
        darkBgLight: 'dark:bg-orange-900/20',
        darkTextColor: 'dark:text-orange-300',
        icon: 'pi pi-truck'
    },
    'entregue': {
        label: 'Entregue',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgLight: 'bg-green-50',
        darkBgLight: 'dark:bg-green-900/20',
        darkTextColor: 'dark:text-green-300',
        icon: 'pi pi-check-circle'
    },
    'cancelado': {
        label: 'Cancelado',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgLight: 'bg-red-50',
        darkBgLight: 'dark:bg-red-900/20',
        darkTextColor: 'dark:text-red-300',
        icon: 'pi pi-times-circle'
    }
};

// Filtros de status
const statusFilters = [
    { value: 'todos', label: 'Todos', count: computed(() => allOrders.value.length) },
    { value: 'em-andamento', label: 'Em andamento', count: computed(() => allOrders.value.filter(o => o.status === 'em-andamento').length) },
    { value: 'em-rota', label: 'Em rota', count: computed(() => allOrders.value.filter(o => o.status === 'em-rota').length) },
    { value: 'entregue', label: 'Entregue', count: computed(() => allOrders.value.filter(o => o.status === 'entregue').length) },
    { value: 'cancelado', label: 'Cancelado', count: computed(() => allOrders.value.filter(o => o.status === 'cancelado').length) }
];

// Pedidos filtrados
const filteredOrders = computed(() => {
    let filtered = allOrders.value;

    // Filtrar por status
    if (selectedStatus.value !== 'todos') {
        filtered = filtered.filter(order => order.status === selectedStatus.value);
    }

    // Filtrar por busca
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.id.toLowerCase().includes(query) ||
            order.items.some(item => item.name.toLowerCase().includes(query))
        );
    }

    return filtered;
});

// Estatísticas
const stats = computed(() => ({
    total: allOrders.value.length,
    active: allOrders.value.filter(o => o.status === 'em-andamento' || o.status === 'em-rota').length,
    completed: allOrders.value.filter(o => o.status === 'entregue').length
}));

// Função para formatar valor
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
</script>

<template>
    <div class="space-y-8">
        <!-- Hero Section -->
        <HeroSection
            title="Meus Pedidos"
            subtitle="Acompanhe o status de todos os seus pedidos de etiquetas"
            greeting="Rastreamento"
            :showButton="true"
            buttonLabel="Fazer Novo Pedido"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-plus"
        />

        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Total de Pedidos</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <i class="pi pi-shopping-cart text-xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.active }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                        <i class="pi pi-clock text-xl text-orange-600 dark:text-orange-400"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.completed }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <i class="pi pi-check-circle text-xl text-green-600 dark:text-green-400"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros e Busca -->
        <div class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 shadow-sm p-6 space-y-4">
            <!-- Filtros de Status -->
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="filter in statusFilters"
                    :key="filter.value"
                    @click="selectedStatus = filter.value"
                    :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedStatus === filter.value
                            ? 'bg-it-primary text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-surface-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-600'
                    ]"
                >
                    {{ filter.label }}
                    <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="selectedStatus === filter.value ? 'bg-white/20' : 'bg-gray-200 dark:bg-surface-600'">
                        {{ filter.count }}
                    </span>
                </button>
            </div>

            <!-- Busca -->
            <IconField iconPosition="left" class="w-full md:w-80">
                <InputIcon class="pi pi-search" />
                <InputText 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Buscar por ID ou produto..." 
                    class="w-full"
                />
            </IconField>
        </div>

        <!-- Lista de Pedidos -->
        <div v-if="filteredOrders.length > 0" class="space-y-4">
            <div
                v-for="order in filteredOrders"
                :key="order.id"
                class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
                <!-- Cabeçalho do pedido -->
                <div class="p-6 border-b border-gray-100 dark:border-surface-700">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-start gap-4">
                            <div :class="[statusConfig[order.status].bgLight, statusConfig[order.status].darkBgLight, 'w-12 h-12 rounded-xl flex items-center justify-center']">
                                <i :class="[statusConfig[order.status].icon, statusConfig[order.status].textColor, statusConfig[order.status].darkTextColor, 'text-xl']"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-3 mb-1">
                                    <h3 class="text-lg! mb-1! font-bold text-gray-900 dark:text-white">{{ order.id }}</h3>
                                    <span
                                        :class="[
                                            statusConfig[order.status].textColor,
                                            statusConfig[order.status].darkTextColor,
                                            statusConfig[order.status].bgLight,
                                            statusConfig[order.status].darkBgLight,
                                            'px-3 py-1 rounded-full text-xs font-medium'
                                        ]"
                                    >
                                        {{ statusConfig[order.status].label }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Pedido realizado em {{ order.date }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(order.total) }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.paymentMethod }}</p>
                        </div>
                    </div>
                </div>

                <!-- Corpo do pedido -->
                <div class="p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Itens do pedido -->
                        <div class="lg:col-span-2 space-y-3">
                            <h4 class="text-sm! font-semibold text-gray-700 dark:text-gray-300 mb-3">Itens do Pedido</h4>
                            <div
                                v-for="(item, index) in order.items"
                                :key="index"
                                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-700 rounded-lg"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-it-primary/10 flex items-center justify-center">
                                        <i class="pi pi-tag text-it-primary"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Quantidade: {{ item.quantity }}</p>
                                    </div>
                                </div>
                                <p class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.price * item.quantity) }}</p>
                            </div>
                        </div>

                        <!-- Informações de entrega/rastreamento -->
                        <div class="space-y-4">
                            <h4 class="text-sm! font-semibold text-gray-700 dark:text-gray-300">Informações de Entrega</h4>
                            
                            <!-- Código de rastreamento -->
                            <div v-if="order.trackingCode" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                                <div class="flex items-start gap-2">
                                    <i class="pi pi-map-marker text-blue-600 dark:text-blue-400 mt-0.5"></i>
                                    <div class="flex-1">
                                        <p class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Código de Rastreamento</p>
                                        <p class="font-mono text-sm text-blue-900 dark:text-blue-300 font-semibold">{{ order.trackingCode }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Data de entrega -->
                            <div v-if="order.deliveryDate" class="flex items-center gap-2 text-sm">
                                <i class="pi pi-calendar text-green-600 dark:text-green-400"></i>
                                <div>
                                    <p class="text-gray-600 dark:text-gray-400">Entregue em</p>
                                    <p class="font-semibold text-gray-900 dark:text-white">{{ order.deliveryDate }}</p>
                                </div>
                            </div>

                            <!-- Previsão de entrega -->
                            <div v-if="order.estimatedDelivery && !order.deliveryDate" class="flex items-center gap-2 text-sm">
                                <i class="pi pi-calendar text-orange-600 dark:text-orange-400"></i>
                                <div>
                                    <p class="text-gray-600 dark:text-gray-400">Previsão de entrega</p>
                                    <p class="font-semibold text-gray-900 dark:text-white">{{ order.estimatedDelivery }}</p>
                                </div>
                            </div>

                            <!-- Informação de cancelamento -->
                            <div v-if="order.cancelReason" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                                <div class="flex items-start gap-2">
                                    <i class="pi pi-info-circle text-red-600 dark:text-red-400 mt-0.5"></i>
                                    <div>
                                        <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Motivo do Cancelamento</p>
                                        <p class="text-sm text-red-900 dark:text-red-300">{{ order.cancelReason }}</p>
                                        <p class="text-xs text-red-600 dark:text-red-400 mt-1">{{ order.cancelDate }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Botão de rastreamento -->
                            <Button
                                v-if="order.trackingCode && order.status !== 'entregue'"
                                label="Rastrear Pedido"
                                icon="pi pi-external-link"
                                size="sm"
                                class="w-full"
                                @click="window.open(`https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}`, '_blank')"
                            />
                        </div>
                    </div>

                    <!-- Barra de progresso -->
                    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-surface-700">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status do Pedido</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                {{ order.status === 'entregue' ? '100%' : order.status === 'em-rota' ? '66%' : order.status === 'em-andamento' ? '33%' : '0%' }}
                            </span>
                        </div>
                        <div class="h-2 rounded-full bg-gray-100 dark:bg-surface-700 overflow-hidden">
                            <div
                                :class="statusConfig[order.status].color"
                                class="h-full transition-all duration-500"
                                :style="{ 
                                    width: order.status === 'entregue' || order.status === 'cancelado' ? '100%' : 
                                           order.status === 'em-rota' ? '66%' : '33%' 
                                }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado vazio -->
        <div v-else class="bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700 shadow-sm p-12">
            <div class="flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-surface-700 flex items-center justify-center">
                    <i class="pi pi-inbox text-4xl text-gray-400 dark:text-gray-500"></i>
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {{ searchQuery ? 'Nenhum pedido encontrado' : 'Nenhum pedido nesta categoria' }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        {{ searchQuery ? 'Tente ajustar sua busca ou filtros.' : 'Faça seu primeiro pedido de etiquetas agora mesmo.' }}
                    </p>
                </div>
                <Button
                    v-if="!searchQuery"
                    label="Fazer Novo Pedido"
                    icon="pi pi-plus"
                    @click="navigateTo('/dashboard/veiculos')"
                />
            </div>
        </div>
    </div>
</template>
