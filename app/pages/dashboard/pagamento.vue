<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import Button from '~/components/forms/Button.vue';
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import CreditCardPreview from '~/components/dashboard/CreditCardPreview.vue';
import Stepper from 'primevue/stepper';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Pagamento - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Revise sua compra, escolha entrega e pague suas etiquetas.' }
    ]
});

// Dados simulados dos kits selecionados
const kits = ref([
    { id: 'tid-6456-575', placa: '6456add4', unidades: 2, valor: 1.0 },
    { id: 'tid-1234-490', placa: 'abc12345', unidades: 2, valor: 1.0 }
]);

const subtotalKits = computed(() => kits.value.reduce((sum, kit) => sum + kit.valor, 0));
const frete = ref(0.1);
const total = computed(() => subtotalKits.value + frete.value);

// Opções de pagamento
const paymentMethod = ref<'credito' | 'pix' | 'boleto'>('credito');

// Opção de entrega
const entrega = ref<'casa' | 'ponto'>('casa');

// Dados de coleta em ponto
const pontoColeta = ref('');
const pontosColetaOptions = ref([
    { label: 'Posto Mauricio Souza', value: 'posto-mauricio', endereco: 'Av. Paulista, 1000 - São Paulo, SP' },
    { label: 'Academia Azurro', value: 'academia-azurro', endereco: 'R. Wisard, 455 - Vila Madalena, SP' },
    { label: 'Centro de Distribuição', value: 'centro-dist', endereco: 'Av. Radial Leste, 2000 - São Paulo, SP' },
    { label: 'Ponto Zona Oeste', value: 'zona-oeste-pt', endereco: 'Av. Imirim, 1500 - Zona Oeste, SP' },
    { label: 'Loja Zona Sul', value: 'zona-sul-loja', endereco: 'Av. Getúlio Vargas, 3000 - Zona Sul, SP' }
]);

const enderecoSelecionado = computed(() => {
    const ponto = pontosColetaOptions.value.find(p => p.value === pontoColeta.value);
    return ponto?.endereco || '';
});

// Dados de cartão de crédito
const cartao = ref({
    numero: '',
    nome: '',
    validade: '',
    cvc: ''
});

// Dados de endereço
const endereco = ref({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
});

const estados = [
    { label: 'AC - Acre', value: 'AC' },
    { label: 'AL - Alagoas', value: 'AL' },
    { label: 'AP - Amapá', value: 'AP' },
    { label: 'AM - Amazonas', value: 'AM' },
    { label: 'BA - Bahia', value: 'BA' },
    { label: 'CE - Ceará', value: 'CE' },
    { label: 'DF - Distrito Federal', value: 'DF' },
    { label: 'ES - Espírito Santo', value: 'ES' },
    { label: 'GO - Goiás', value: 'GO' },
    { label: 'MA - Maranhão', value: 'MA' },
    { label: 'MT - Mato Grosso', value: 'MT' },
    { label: 'MS - Mato Grosso do Sul', value: 'MS' },
    { label: 'MG - Minas Gerais', value: 'MG' },
    { label: 'PA - Pará', value: 'PA' },
    { label: 'PB - Paraíba', value: 'PB' },
    { label: 'PR - Paraná', value: 'PR' },
    { label: 'PE - Pernambuco', value: 'PE' },
    { label: 'PI - Piauí', value: 'PI' },
    { label: 'RJ - Rio de Janeiro', value: 'RJ' },
    { label: 'RN - Rio Grande do Norte', value: 'RN' },
    { label: 'RS - Rio Grande do Sul', value: 'RS' },
    { label: 'RO - Rondônia', value: 'RO' },
    { label: 'RR - Roraima', value: 'RR' },
    { label: 'SC - Santa Catarina', value: 'SC' },
    { label: 'SP - São Paulo', value: 'SP' },
    { label: 'SE - Sergipe', value: 'SE' },
    { label: 'TO - Tocantins', value: 'TO' }
];

const loadingCep = ref(false);
const cepError = ref('');

const buscarCEP = async (cep: string) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        return;
    }

    loadingCep.value = true;
    cepError.value = '';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            cepError.value = 'CEP não encontrado';
            return;
        }

        endereco.value.rua = data.logradouro;
        endereco.value.bairro = data.bairro;
        endereco.value.cidade = data.localidade;
        endereco.value.estado = data.uf;
    } catch (error) {
        cepError.value = 'Erro ao buscar CEP';
        console.error(error);
    } finally {
        loadingCep.value = false;
    }
};

const handleCepChange = (value: string) => {
    endereco.value.cep = value;
    buscarCEP(value);
};
</script>

<template>
    <div class="space-y-10">
        <HeroSection
            title="Checkout"
            subtitle="Revise sua compra, escolha entrega e pague suas etiquetas."
            :showButton="true"
            buttonLabel="Voltar"
            buttonLinkBack
            buttonIcon="pi pi-arrow-left"
        />

        <div class="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <!-- Badge de Valor Total -->
            <div class="absolute -top-4 right-6 bg-emerald-500 text-white rounded-full shadow-lg px-5 py-2.5 z-10">
                <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                        <span class="text-xs font-medium opacity-90">Total</span>
                        <span class="text-xl font-bold">R$ {{ total.toFixed(2) }}</span>
                    </div>
                    <div class="w-px h-8 bg-white/30"></div>
                    <div class="flex flex-col text-xs">
                        <span class="opacity-80">{{ kits.length }} kit{{ kits.length > 1 ? 's' : '' }}</span>
                        <span class="opacity-80">+ frete R$ {{ frete.toFixed(2) }}</span>
                    </div>
                </div>
            </div>

            <Stepper value="1" class="w-full">
                <!-- Step 1: Entrega/Retirada -->
                <StepItem value="1">
                    <Step>Entrega / Retirada</Step>
                    <StepPanel :value="1">
                        <template #default="{ activateCallback }">
                            <div class="space-y-6">
                            <h3 class="text-lg! font-semibold text-gray-900">Opção de Entrega/Retirada</h3>
                            <div class="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    :class="[
                                        'px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition',
                                        entrega === 'casa' ? 'border-it-primary text-it-primary bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-it-primary'
                                    ]"
                                    @click="entrega = 'casa'"
                                >
                                    <i class="pi pi-home"></i>
                                    Receber em Casa
                                </button>
                                <button
                                    type="button"
                                    :class="[
                                        'px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition',
                                        entrega === 'ponto' ? 'border-it-primary text-it-primary bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-it-primary'
                                    ]"
                                    @click="entrega = 'ponto'"
                                >
                                    <i class="pi pi-building"></i>
                                    Retirar em Ponto de Coleta
                                </button>
                            </div>

                            <!-- Container com Formulário e Imagem -->
                            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <!-- Coluna Esquerda: Formulário (60%) -->
                                <div class="lg:col-span-3 space-y-4">
                                    <!-- RECEBER EM CASA - Endereço -->
                                    <div v-if="entrega === 'casa'">
                                        <div v-if="cepError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                                            {{ cepError }}
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
                                            <InputText
                                                v-model="endereco.cep"
                                                label="CEP"
                                                placeholder="00000-000"
                                                mask="99999-999"
                                                icon="pi pi-map-marker"
                                                @change="(e) => handleCepChange((e.target as HTMLInputElement).value)"
                                                :disabled="loadingCep"
                                                wrapper-class="lg:col-span-3"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="endereco.rua"
                                                label="Logradouro"
                                                placeholder="Av. Paulista"
                                                icon="pi pi-road"
                                                :readonly="true"
                                                wrapper-class="md:col-span-2 lg:col-span-7"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="endereco.numero"
                                                label="Número"
                                                placeholder="1000"
                                                type="number"
                                                icon="pi pi-hashtag"
                                                wrapper-class="lg:col-span-5"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="endereco.complemento"
                                                label="Complemento"
                                                placeholder="Apto 101"
                                                icon="pi pi-building"
                                                wrapper-class="lg:col-span-5"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="endereco.bairro"
                                                label="Bairro"
                                                placeholder="Bela Vista"
                                                icon="pi pi-map"
                                                :readonly="true"
                                                wrapper-class="lg:col-span-5"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="endereco.cidade"
                                                label="Cidade"
                                                placeholder="São Paulo"
                                                icon="pi pi-building"
                                                :readonly="true"
                                                wrapper-class="lg:col-span-5"
                                                inputClass="w-full"
                                            />
                                            <SelectInput
                                                v-model="endereco.estado"
                                                label="Estado"
                                                :options="estados"
                                                placeholder="Selecione o estado"
                                                icon="pi pi-map-marker"
                                                :readonly="true"
                                                wrapper-class="lg:col-span-5"
                                                inputClass="w-full"
                                            />
                                            
                                            <!-- Card de Frete -->
                                            <div class="lg:col-span-5 flex flex-col justify-end">
                                                <label class="block text-sm font-semibold text-gray-900 mb-2">Frete</label>
                                                <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-4 py-4 h-[60px] flex items-center justify-between">
                                                    <div class="flex items-center gap-2 text-gray-700">
                                                        <i class="pi pi-truck text-it-primary"></i>
                                                        <span class="text-sm font-medium">Custo de Entrega</span>
                                                    </div>
                                                    <span class="text-lg font-bold text-it-primary">R$ {{ frete.toFixed(2) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- RETIRAR EM PONTO DE COLETA -->
                                    <div v-else-if="entrega === 'ponto'" class="space-y-4 p-8 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div>
                                            <h3 class="text-lg! font-semibold text-gray-900 mb-4">Pontos de Coleta</h3>
                                        </div>
                                        
                                        <SelectInput
                                            v-model="pontoColeta"
                                            label="Selecione um Ponto de Coleta"
                                            :options="pontosColetaOptions"
                                            placeholder="Escolha um local"
                                            icon="pi pi-map-marker"
                                            wrapper-class="w-full"
                                            inputClass="w-full"
                                        />

                                        <div v-if="enderecoSelecionado" class="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-4">
                                            <p class="text-sm text-gray-700">
                                                <span class="font-semibold">Endereço:</span> {{ enderecoSelecionado }}
                                            </p>
                                        </div>
                                        <p v-else class="text-sm text-gray-600 mt-3">Selecione um ponto para ver o endereço.</p>

                                        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-4">
                                            <p class="text-sm text-gray-700">
                                                <span class="font-semibold">Instruções:</span> Leve um documento de identificação e o número da etiqueta para retirada.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Coluna Direita: Imagem (40%) -->
                                <div class="lg:col-span-2 hidden md:block">
                                    <div class="bg-gray-100 gap-4 rounded-2xl overflow-hidden h-full flex items-center justify-center min-h-75">
                                        <img 
                                            src="/images/dashboard/post-01.jpg" 
                                            alt="Entrega e Retirada" 
                                            class="w-[300px] "
                                        />
                                        <img 
                                            src="/images/dashboard/post-02.jpg" 
                                            alt="Entrega e Retirada" 
                                            class="w-[300px] "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end pt-6">
                            <Button label="Continuar" size="sm" icon="pi pi-chevron-right color-it-primary" labelClass="color-it-primary" buttonClass="bg-[#dfe1ff]!" @click="activateCallback(2)" />
                        </div>
                        </template>
                    </StepPanel>
                </StepItem>

                <!-- Step 2: Resumo -->
                <StepItem :value="2">
                    <Step>Resumo</Step>
                    <StepPanel :value="2">
                        <template #default="{ activateCallback }">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <h3 class="text-lg! color-it-primary font-semibold mb-3">Resumo dos Kits de Etiquetas</h3>
                                <div class="space-y-3">
                                    <div
                                        v-for="kit in kits"
                                        :key="kit.id"
                                        class="flex items-start justify-between text-sm text-gray-700"
                                    >
                                        <div class="space-y-1">
                                            <p class="font-bold">Kit Etiquetas: {{ kit.id.toUpperCase() }}</p>
                                            <p class="text-gray-500">Veículo: {{ kit.placa }} • {{ kit.unidades }} unidade(s)</p>
                                        </div>
                                        <span class="font-semibold">R$ {{ kit.valor.toFixed(2) }}</span>
                                    </div>
                                </div>
                                <div class="border-t border-gray-200 mt-4 pt-3 text-sm font-semibold text-gray-900">
                                    Subtotal ({{ kits.length }} kit{{ kits.length > 1 ? 's' : '' }}): R$ {{ subtotalKits.toFixed(2) }}
                                </div>
                            </div>

                            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <h3 class="text-lg! color-it-primary font-semibold mb-3">Resumo Financeiro</h3>
                                <div class="space-y-3 text-sm text-gray-700">
                                    <div class="flex justify-between">
                                        <span>Subtotal Kits ({{ kits.length }}x)</span>
                                        <span class="font-semibold">R$ {{ subtotalKits.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Frete</span>
                                        <span class="font-semibold">R$ {{ frete.toFixed(2) }}</span>
                                    </div>
                                    <div class="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>R$ {{ total.toFixed(2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between pt-6 gap-3">
                            <Button label="Voltar" icon="pi pi-chevron-left color-it-primary" size="sm" labelClass="color-it-primary" buttonClass="bg-[#dfe1ff]!" @click="activateCallback('1')" />
                            <Button label="Continuar" size="sm" icon="pi pi-chevron-right color-it-primary" labelClass="color-it-primary" buttonClass="bg-[#dfe1ff]!" @click="activateCallback(3)" />
                        </div>
                        </template>
                    </StepPanel>
                </StepItem>

                <!-- Step 3: Pagamento -->
                <StepItem :value="3">
                    <Step>Pagamento</Step>
                    <StepPanel :value="3">
                        <template #default="{ activateCallback }">
                            <div class="space-y-6">
                            <h3 class="text-lg! font-semibold text-gray-900">Forma de Pagamento</h3>
                            <div class="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    :class="[
                                        'px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition',
                                        paymentMethod === 'credito' ? 'border-it-primary text-it-primary bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-it-primary'
                                    ]"
                                    @click="paymentMethod = 'credito'"
                                >
                                    <i class="pi pi-credit-card"></i>
                                    Cartão de Crédito
                                </button>
                                <button
                                    type="button"
                                    :class="[
                                        'px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition',
                                        paymentMethod === 'pix' ? 'border-it-primary text-it-primary bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-it-primary'
                                    ]"
                                    @click="paymentMethod = 'pix'"
                                >
                                    <i class="pi pi-qrcode"></i>
                                    PIX
                                </button>
                                <button
                                    type="button"
                                    :class="[
                                        'px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition',
                                        paymentMethod === 'boleto' ? 'border-it-primary text-it-primary bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-it-primary'
                                    ]"
                                    @click="paymentMethod = 'boleto'"
                                >
                                    <i class="pi pi-bars"></i>
                                    Boleto
                                </button>
                            </div>

                            <div v-if="paymentMethod === 'credito'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Coluna Esquerda: Campos -->
                                <div class="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p class="text-sm font-semibold text-gray-800">Campos de cartão (simulação):</p>
                                    <div class="grid grid-cols-1 gap-4">
                                        <InputText
                                            v-model="cartao.nome"
                                            label="Nome no Cartão"
                                            placeholder="Nome como no cartão"
                                            icon="pi pi-user"
                                            inputClass="w-full"
                                        />
                                        <InputText
                                            v-model="cartao.numero"
                                            label="Número do Cartão"
                                            placeholder="0000 0000 0000 0000"
                                            mask="9999 9999 9999 9999"
                                            icon="pi pi-credit-card"
                                            inputClass="w-full"
                                        />
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputText
                                                v-model="cartao.validade"
                                                label="Validade (MM/AA)"
                                                placeholder="MM/AA"
                                                mask="99/99"
                                                icon="pi pi-calendar"
                                                inputClass="w-full"
                                            />
                                            <InputText
                                                v-model="cartao.cvc"
                                                label="CVC"
                                                placeholder="123"
                                                mask="999"
                                                icon="pi pi-lock"
                                                inputClass="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- Coluna Direita: Preview do Cartão (apenas desktop) -->
                                <div class="hidden lg:flex items-center justify-center">
                                    <CreditCardPreview
                                        :numero="cartao.numero"
                                        :nome="cartao.nome"
                                        :validade="cartao.validade"
                                        :cvc="cartao.cvc"
                                    />
                                </div>
                            </div>

                            <div v-else-if="paymentMethod === 'pix'" class="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <p class="text-sm font-semibold text-gray-800">Pague via PIX:</p>
                                <p class="text-sm text-gray-600">Geraremos um QR Code para pagamento imediato.</p>
                            </div>

                            <div v-else class="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <p class="text-sm font-semibold text-gray-800">Boleto bancário:</p>
                                <p class="text-sm text-gray-600">Geraremos seu boleto após a confirmação.</p>
                            </div>
                        </div>
                        <div class="flex justify-start pt-6 gap-3">
                            <Button label="Voltar" icon="pi pi-chevron-left color-it-primary" size="sm" labelClass="color-it-primary" buttonClass="bg-[#dfe1ff]!" @click="activateCallback(2)" />
                            <Button label="Realizar pagamento" icon="pi pi-check" size="sm" />
                        </div>
                        </template>
                    </StepPanel>
                </StepItem>
            </Stepper>
        </div>
    </div>
</template>

<style scoped>
/* Estilos se necessário */
</style>
