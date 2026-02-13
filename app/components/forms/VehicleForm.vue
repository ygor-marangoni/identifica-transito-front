<script setup lang="ts">
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import { ESTADOS_REGISTRO, TIPOS_VEICULO, PERFIS_USO, type VehicleFormData } from '~/utils/vehicleFormData';

interface Props {
    formData: VehicleFormData;
    municipios: Array<{ label: string; value: string }>;
    municipiosLoading: boolean;
    loading: boolean;
    buttonLabel: string;
}

interface Emits {
    submit: [];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
    <form @submit.prevent="$emit('submit')" class="space-y-8">
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
                    :disabled="loading"
                    inputClass="w-full px-4 py-3 uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                />

                <!-- Tipo do Veículo -->
                <SelectInput
                    v-model="formData.tipoVeiculo"
                    id="tipoVeiculo"
                    label="Tipo do Veículo"
                    :options="TIPOS_VEICULO"
                    placeholder="Selecione o tipo"
                    optionLabel="label"
                    optionValue="value"
                    icon="pi pi-list"
                    required
                    :disabled="loading"
                />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Estado de Registro -->
                <SelectInput
                    v-model="formData.estadoRegistro"
                    id="estadoRegistro"
                    label="Estado de Registro"
                    :options="ESTADOS_REGISTRO"
                    placeholder="Selecione o estado (UF)"
                    optionLabel="label"
                    optionValue="value"
                    :filter="true"
                    filterPlaceholder="Buscar estado..."
                    icon="pi pi-map"
                    required
                    :disabled="loading"
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
                    :disabled="!formData.estadoRegistro || municipiosLoading || loading"
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
                <div v-for="perfil in PERFIS_USO" :key="perfil.id" class="flex items-center gap-3">
                    <input
                        type="radio"
                        :id="String(perfil.id)"
                        :value="perfil.id"
                        v-model.number="formData.perfilUso"
                        required
                        class="mt-1 w-5 h-5 text-it-primary border-gray-300 focus:ring-it-primary cursor-pointer"
                    />
                    <label :for="String(perfil.id)" class="text-md font-medium text-gray-900 cursor-pointer">
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
            {{ buttonLabel }}
        </Button>
    </form>
</template>
