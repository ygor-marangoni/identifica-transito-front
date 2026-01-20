<script setup lang="ts">
import { ref, watch } from 'vue';
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import { useToast } from 'primevue/usetoast';

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
const toast = useToast();
const municipios = ref<Array<{ label: string; value: string }>>([]);
const municipiosLoading = ref(false);

// Buscar municípios da API IBGE
const fetchMunicipios = async (uf: string) => {
    if (!uf) {
        municipios.value = [];
        formData.value.cidadeRegistro = '';
        return;
    }

    municipiosLoading.value = true;
    try {
        const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        );
        const data = await response.json();
        
        // Mapear resultado da API para formato do SelectInput
        municipios.value = data.map((municipio: any) => ({
            label: municipio.nome,
            value: municipio.nome
        })).sort((a: any, b: any) => a.label.localeCompare(b.label));
        
        // Limpar seleção anterior de cidade
        formData.value.cidadeRegistro = '';
    } catch (error) {
        console.error('Erro ao buscar municípios:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar as cidades.',
            life: 3000
        });
        municipios.value = [];
    } finally {
        municipiosLoading.value = false;
    }
};

// Watchers para monitorar mudanças no estado
watch(() => formData.value.estadoRegistro, (newUF) => {
    if (newUF) {
        fetchMunicipios(newUF);
    }
});

// Opções para dropdowns
const tiposVeiculo = [
    { label: 'Automóvel', value: 'automovel', icon: 'pi pi-car' },
    { label: 'Motocicleta', value: 'motocicleta', icon: 'pi pi-motorcycle' },
    { label: 'Caminhão', value: 'caminhao', icon: 'pi pi-truck' },
    { label: 'Ônibus', value: 'onibus', icon: 'pi pi-bus' },
    { label: 'Outro', value: 'outro', icon: 'pi pi-ellipsis-h' }
];

const estadosRegistro = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
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
        toast.add({
            severity: 'error',
            summary: 'Erro ao cadastrar',
            detail: 'Por favor, preencha todos os campos obrigatórios.',
            life: 3000
        });
        return;
    }

    loading.value = true;
    console.log('Cadastrando veículo:', formData.value);

    // Simular cadastro
    setTimeout(() => {
        loading.value = false;
        toast.add({
            severity: 'success',
            summary: 'Veículo cadastrado!',
            detail: 'Seu veículo foi cadastrado com sucesso, compre agora sua etiqueta.',
            life: 3000
        });
        // Limpar formulário
        formData.value = {
            placa: '',
            tipoVeiculo: '',
            estadoRegistro: '',
            cidadeRegistro: '',
            perfilUso: ''
        };
        // Redirecionar para dashboard/veiculos (simulado)
        // navigateTo('/dashboard/veiculos');
    }, 2000);
};
</script>

<template>
    <div class="space-y-10">
        <!-- Hero -->
        <HeroSection
            title="Novo Veículo"
            subtitle="Cadastre seu veículo para gerar a etiqueta Identifica Trânsito."
            :showButton="true"
            buttonLabel="Voltar para Meus Veículos"
            buttonLink="/dashboard/veiculos"
            buttonIcon="pi pi-arrow-left"
        />
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
                                icon="pi pi-list"
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
                                optionLabel="label"
                                optionValue="value"
                                :filter="true"
                                filterPlaceholder="Buscar estado..."
                                icon="pi pi-map"
                                required
                            />

                            <!-- Cidade de Registro -->
                            <SelectInput
                                :key="formData.estadoRegistro"
                                v-model="formData.cidadeRegistro"
                                id="cidadeRegistro"
                                label="Cidade de Registro"
                                :options="municipios"
                                placeholder="Selecione a cidade"
                                optionLabel="label"
                                optionValue="value"
                                :filter="true"
                                filterPlaceholder="Buscar cidade..."
                                icon="pi pi-map-marker"
                                :disabled="!formData.estadoRegistro || municipiosLoading"
                                required
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
                        <i v-if="!loading" class="pi pi-check"></i>
                        Cadastrar veículo
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
