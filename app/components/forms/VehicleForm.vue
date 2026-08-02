<script setup lang="ts">
import { ref, computed } from 'vue';
import { Baby, Brain, Briefcase, CalendarDays, CarFront, Check, EyeOff, Heart, IdCard, List, Map, MapPin, Smartphone, UserRound } from '@lucide/vue';
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

const profileIcons = {
    1: UserRound,
    2: Brain,
    3: EyeOff,
    4: Heart,
    5: Baby,
    6: IdCard,
    7: IdCard,
    8: Briefcase,
    9: Smartphone
};

const getProfileIcon = (id: number) => profileIcons[id as keyof typeof profileIcons] || UserRound;

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
    <form @submit.prevent="handleSubmit" novalidate class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Seção 1: Dados do Veículo -->
        <section class="vehicle-data-section rounded-xl border border-slate-200 bg-[#fafafa] p-5 sm:p-6 lg:col-span-1">
            <div class="mb-6 flex items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf0ff] text-[#1f46ee]">
                    <CarFront :size="18" :stroke-width="1.9" aria-hidden="true" />
                </div>
                <div>
                    <h2 class="relative top-0.5 text-lg! font-semibold text-[#172b4d] mb-1!">Dados do veículo</h2>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
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
                        :icon="CarFront"
                        :disabled="loading"
                        inputClass="w-full px-4 py-3 uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 placeholder-gray-400"
                    />
                    <p v-if="showPlacaRequiredError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>
                    <p v-else-if="showPlacaFormatError" class="mt-1.5 text-xs text-red-700">Placa inválida. Use o formato antigo (AAA0000) ou Mercosul (AAA0A00).</p>
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
                        :icon="List"
                        required
                        :disabled="loading"
                    />
                    <p v-if="showTipoVeiculoError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>
                </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
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
                        :icon="Map"
                        required
                        :disabled="loading"
                    />
                    <p v-if="showEstadoRegistroError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>
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
                        :icon="MapPin"
                        :disabled="!formData.estadoRegistro || municipiosLoading || loading"
                        required
                    />
                    <p v-if="showCidadeRegistroError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>
                </div>
            </div>
        </section>

        <!-- Seção 2: Perfil de Uso -->
        <section class="rounded-xl border border-slate-200 bg-[#fafafa] p-5 sm:p-6 lg:col-span-1">
            <div class="mb-6 flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#1f46ee]">
                    <UserRound :size="18" :stroke-width="1.9" aria-hidden="true" />
                </div>
                <div>
                    <h2 class="relative top-0.5 text-lg! font-semibold text-[#172b4d] mb-1!">Perfil de uso</h2>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label v-for="perfil in PERFIS_USO" :key="perfil.id" :for="String(perfil.id)" class="profile-option flex min-h-[50px] cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:border-[#aebfff] hover:bg-[#f6f8ff] has-[:checked]:border-[#1f46ee] has-[:checked]:bg-[#f2f5ff]">
                    <input
                        type="radio"
                        name="perfilUso"
                        :id="String(perfil.id)"
                        :value="perfil.id"
                        v-model.number="formData.perfilUso"
                        class="h-4 w-4 border-slate-300 text-[#1f46ee] focus:ring-[#1f46ee] cursor-pointer"
                    />
                    <component :is="getProfileIcon(perfil.id)" :size="15" :stroke-width="1.9" class="text-slate-500" aria-hidden="true" />
                    <span class="text-sm font-medium text-slate-800">
                        {{ perfil.label }}
                    </span>
                </label>
            </div>
            <p v-if="showPerfilUsoError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>

            <div v-if="isRecemNascido" class="mt-6 max-w-sm">
                <InputText
                    v-model="formData.babyDateOfBirth"
                    type="text"
                    id="babyDateOfBirth"
                    label="Data de Nascimento do Recém-nascido"
                    placeholder="01/10/2024"
                    mask="99/99/9999"
                    required
                    showIcon
                    :icon="CalendarDays"
                    :disabled="loading"
                    inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 placeholder-gray-400"
                />
                <p v-if="showBabyDateRequiredError" class="mt-1.5 text-xs text-red-700">Campo obrigatório.</p>
                <p v-else-if="showBabyDateInvalidError" class="mt-1.5 text-xs text-red-700">Data inválida.</p>
                <p v-else-if="showBabyDateFutureError" class="mt-1.5 text-xs text-red-700">A data não pode ser no futuro.</p>
                <p v-else-if="showBabyDateTooOldError" class="mt-1.5 text-xs text-red-700">O recém-nascido não pode ter mais de 2 anos.</p>
            </div>
        </section>

        <!-- Botão Submit -->
        <div class="flex justify-center pt-1 lg:col-span-2 lg:justify-end">
        <Button type="submit" fullWidth :loading="loading" size="md" buttonClass="lg:max-w-md hover:brightness-95">
            <Check v-if="!loading" :size="18" :stroke-width="2.3" aria-hidden="true" />
            {{ buttonLabel }}
        </Button>
        </div>
    </form>
</template>

<style scoped>
.profile-option,
.profile-option span {
    font-family: 'Figtree', sans-serif !important;
}

@media (max-width: 639px) {
    .vehicle-data-section :deep(.p-inputtext),
    .vehicle-data-section :deep(.p-inputmask),
    .vehicle-data-section :deep(.p-select) {
        height: 48px !important;
        min-height: 48px !important;
    }
}
</style>
