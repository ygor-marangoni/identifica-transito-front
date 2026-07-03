<script setup lang="ts">
import { ref, computed } from 'vue';
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import { ESTADOS_REGISTRO, TIPOS_VEICULO, PERFIS_USO, type VehicleFormData } from '~/utils/vehicleFormData';
import { USAGE_PROFILE } from '~/utils/vehicleEnums';
import { isValidPlate } from '~/utils/plate';

const BABY_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const parseBrDate = (value: string): Date | null => {
    const match = BABY_DATE_REGEX.exec(value || '');
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
    }
    return date;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const twoYearsAgo = new Date(today);
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

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

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const attemptedSubmit = ref(false);

const showPlacaRequiredError = computed(() => attemptedSubmit.value && !props.formData.placa);
const showPlacaFormatError = computed(() => attemptedSubmit.value && !!props.formData.placa && !isValidPlate(props.formData.placa));
const showTipoVeiculoError = computed(() => attemptedSubmit.value && !props.formData.tipoVeiculo);
const showEstadoRegistroError = computed(() => attemptedSubmit.value && !props.formData.estadoRegistro);
const showCidadeRegistroError = computed(() => attemptedSubmit.value && !props.formData.cidadeRegistro);
const showPerfilUsoError = computed(() => attemptedSubmit.value && !props.formData.perfilUso);

const isRecemNascido = computed(() => Number(props.formData.perfilUso) === USAGE_PROFILE.RECEM_NASCIDO);
const babyDate = computed(() => parseBrDate(props.formData.babyDateOfBirth));
const isBabyDateComplete = computed(() => BABY_DATE_REGEX.test(props.formData.babyDateOfBirth));

const showBabyDateRequiredError = computed(() => attemptedSubmit.value && isRecemNascido.value && !props.formData.babyDateOfBirth);
const showBabyDateInvalidError = computed(() => isRecemNascido.value && isBabyDateComplete.value && !babyDate.value);
const showBabyDateFutureError = computed(() => isRecemNascido.value && !!babyDate.value && babyDate.value > today);
const showBabyDateTooOldError = computed(() => isRecemNascido.value && !!babyDate.value && babyDate.value < twoYearsAgo);

const isBabyDateValid = computed(() => {
    if (!isRecemNascido.value) return true;
    return !!babyDate.value && babyDate.value <= today && babyDate.value >= twoYearsAgo;
});

const isFormValid = computed(() => {
    return !!props.formData.placa
        && isValidPlate(props.formData.placa)
        && !!props.formData.tipoVeiculo
        && !!props.formData.estadoRegistro
        && !!props.formData.cidadeRegistro
        && !!props.formData.perfilUso
        && isBabyDateValid.value;
});

const handleSubmit = () => {
    attemptedSubmit.value = true;
    if (!isFormValid.value) return;
    emit('submit');
};
</script>

<template>
    <form @submit.prevent="handleSubmit" novalidate class="space-y-8">
        <!-- Seção 1: Dados do Veículo -->
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Placa do Veículo -->
                <div>
                    <InputText
                        v-model="formData.placa"
                        type="text"
                        id="placa"
                        label="Placa do Veículo"
                        placeholder="AAA0A00 ou ABC1234"
                        mask="aaa9*99"
                        required
                        showIcon
                        icon="pi pi-car"
                        :disabled="loading"
                        inputClass="w-full px-4 py-3 uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                    />
                    <p v-if="showPlacaRequiredError" class="text-red-500 text-xs mt-1">Campo obrigatório.</p>
                    <p v-else-if="showPlacaFormatError" class="text-red-500 text-xs mt-1">Placa inválida. Use o formato antigo (AAA0000) ou Mercosul (AAA0A00).</p>
                </div>

                <!-- Tipo do Veículo -->
                <div>
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
                    <p v-if="showTipoVeiculoError" class="text-red-500 text-xs mt-1">Campo obrigatório.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Estado de Registro -->
                <div>
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
                    <p v-if="showEstadoRegistroError" class="text-red-500 text-xs mt-1">Campo obrigatório.</p>
                </div>

                <!-- Cidade de Registro -->
                <div>
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
                    <p v-if="showCidadeRegistroError" class="text-red-500 text-xs mt-1">Campo obrigatório.</p>
                </div>
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
                        name="perfilUso"
                        :id="String(perfil.id)"
                        :value="perfil.id"
                        v-model.number="formData.perfilUso"
                        class="mt-1 w-5 h-5 text-it-primary border-gray-300 focus:ring-it-primary cursor-pointer"
                    />
                    <label :for="String(perfil.id)" class="text-md font-medium text-gray-900 cursor-pointer">
                        {{ perfil.label }}
                    </label>
                </div>
            </div>
            <p v-if="showPerfilUsoError" class="text-red-500 text-xs">Campo obrigatório.</p>

            <div v-if="isRecemNascido" class="max-w-sm">
                <InputText
                    v-model="formData.babyDateOfBirth"
                    type="text"
                    id="babyDateOfBirth"
                    label="Data de Nascimento do Recém-nascido"
                    placeholder="01/10/2024"
                    mask="99/99/9999"
                    required
                    showIcon
                    icon="pi pi-calendar"
                    :disabled="loading"
                    inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                />
                <p v-if="showBabyDateRequiredError" class="text-red-500 text-xs mt-1">Campo obrigatório.</p>
                <p v-else-if="showBabyDateInvalidError" class="text-red-500 text-xs mt-1">Data inválida.</p>
                <p v-else-if="showBabyDateFutureError" class="text-red-500 text-xs mt-1">A data não pode ser no futuro.</p>
                <p v-else-if="showBabyDateTooOldError" class="text-red-500 text-xs mt-1">O recém-nascido não pode ter mais de 2 anos.</p>
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
