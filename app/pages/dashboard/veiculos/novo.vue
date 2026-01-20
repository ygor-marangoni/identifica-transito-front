<script setup lang="ts">
import { ref } from 'vue';
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Cadastrar Novo Veículo - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Cadastre seu veículo e gere sua etiqueta de identificação.' }
    ]
});

const formData = ref({
    placa: '',
    tipoVeiculo: '',
    estadoRegistro: '',
    cidadeRegistro: '',
    perfilUso: ''
});

const loading = ref(false);

// Opções para dropdowns
const tiposVeiculo = [
    { label: 'Automóvel', value: 'automovel', icon: 'pi pi-car' },
    { label: 'Motocicleta', value: 'motocicleta', icon: 'pi pi-motorcycle' },
    { label: 'Caminhão', value: 'caminhao', icon: 'pi pi-truck' },
    { label: 'Ônibus', value: 'onibus', icon: 'pi pi-bus' },
    { label: 'Outro', value: 'outro', icon: 'pi pi-ellipsis-h' }
];

const estadosRegistro = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const perfisUso = [
    { id: 'idoso', label: 'Pessoa idosa', icon: 'pi pi-user' },
    { id: 'autista', label: 'Autista', icon: 'pi pi-user' },
    { id: 'deficiencias_ocultas', label: 'Deficiências Ocultas', icon: 'pi pi-eye-slash' },
    { id: 'gestante', label: 'Gestante', icon: 'pi pi-heart' },
    { id: 'recem_nascido', label: 'Recém-nascido', icon: 'pi pi-heart' },
    { id: 'cnh_definitiva', label: 'CNH definitiva', icon: 'pi pi-id-card' },
    { id: 'cnh_temporaria', label: 'CNH temporária', icon: 'pi pi-id-card' },
    { id: 'empresa', label: 'Empresa', icon: 'pi pi-briefcase' },
    { id: 'aplicativo', label: 'Aplicativo (Uber/99)', icon: 'pi pi-mobile' }
];

const handleRegisterVehicle = () => {
    if (!formData.value.placa || !formData.value.tipoVeiculo || !formData.value.estadoRegistro || !formData.value.cidadeRegistro || !formData.value.perfilUso) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    loading.value = true;
    console.log('Cadastrando veículo:', formData.value);

    // Simular cadastro
    setTimeout(() => {
        loading.value = false;
        // Redirecionar para dashboard/veiculos
        navigateTo('/dashboard/veiculos');
    }, 2000);
};
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar Novo Veículo</h1>
            <p class="text-gray-600 mb-8!">Preencha as informações do seu veículo para gerar a etiqueta de identificação Identifica Trânsito.</p>

            <form @submit.prevent="handleRegisterVehicle" class="space-y-8">
                <!-- Seção 1: Dados do Veículo -->
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Placa do Veículo -->
                        <InputText
                            v-model="formData.placa"
                            type="text"
                            id="placa"
                            label="Placa do Veículo"
                            placeholder="AAA0A00 ou ABC1234"
                            required
                            showIcon
                            icon="pi pi-car"
                            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                        />

                        <!-- Tipo do Veículo -->
                        <SelectInput
                            v-model="formData.tipoVeiculo"
                            id="tipoVeiculo"
                            label="Tipo do Veículo"
                            :options="tiposVeiculo"
                            placeholder="Selecione o tipo"
                            optionLabel="label"
                            optionValue="value"
                            :filter="true"
                            filterPlaceholder="Buscar tipo..."
                            required
                        />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Estado de Registro -->
                        <SelectInput
                            v-model="formData.estadoRegistro"
                            id="estadoRegistro"
                            label="Estado de Registro"
                            :options="estadosRegistro"
                            placeholder="Selecione o estado (UF)"
                            :filter="true"
                            filterPlaceholder="Buscar estado..."
                            required
                        />

                        <!-- Cidade de Registro -->
                        <InputText
                            v-model="formData.cidadeRegistro"
                            type="text"
                            id="cidadeRegistro"
                            label="Cidade de Registro"
                            placeholder="Nome da cidade"
                            required
                            showIcon
                            icon="pi pi-map-marker"
                            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                        />
                    </div>
                </div>

                <!-- Divisor -->
                <div class="border-t border-gray-200"></div>

                <!-- Seção 2: Perfil de Uso -->
                <div class="space-y-4">
                    <div>
                        <h2 class="text-lg! font-semibold text-gray-900 mb-2!">Perfil de Uso</h2>
                        <p class="text-md text-gray-600">Selecione o perfil que melhor descreve o uso principal do veículo.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div v-for="perfil in perfisUso" :key="perfil.id" class="flex items-center gap-3">
                            <input
                                type="radio"
                                :id="perfil.id"
                                :value="perfil.id"
                                v-model="formData.perfilUso"
                                required
                                class="mt-1 w-5 h-5 text-it-primary border-gray-300 focus:ring-it-primary cursor-pointer"
                            />
                            <label :for="perfil.id" class="text-md font-medium text-gray-900 cursor-pointer">
                                {{ perfil.label }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Divisor -->
                <div class="border-t border-gray-200"></div>

                <!-- Botão Submit -->
                <Button type="submit" fullWidth :loading="loading" size="lg">
                    <i class="pi pi-check"></i>
                    Cadastrar veículo
                </Button>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
